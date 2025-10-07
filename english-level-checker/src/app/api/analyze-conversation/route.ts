import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 型定義
interface ConversationTurn {
  speaker: string;
  text: string;
  timestamp: string;
}

interface ElevenLabsConversationData {
  turns?: ConversationTurn[];
  [key: string]: unknown;
}

interface ConversationMessage {
  turnNumber: number;
  speaker: string;
  text: string;
  timestamp: string;
}

// ElevenLabs APIから会話データを取得
async function getConversationFromElevenLabs(conversationId: string) {
  const response = await fetch(
    `https://api.elevenlabs.io/v1/convai/conversations/${conversationId}`,
    {
      headers: {
        "xi-api-key": process.env.ELEVENLABS_API_KEY || "",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`ElevenLabs API error: ${response.status}`);
  }

  return await response.json();
}

// Gemini APIで会話を分析
async function analyzeConversationWithGemini(
  conversationData: ElevenLabsConversationData
) {
  // 会話のトランスクリプトを整理
  const transcript =
    conversationData.turns?.map((turn: ConversationTurn) => ({
      speaker: turn.speaker,
      text: turn.text,
      timestamp: turn.timestamp,
    })) || [];

  const prompt = `
以下の英会話を分析して、JSON形式で結果を返してください。

会話データ:
${JSON.stringify(transcript, null, 2)}

以下の形式で分析結果を返してください:
{
  "cefrLevel": "A1|A2|B1|B2|C1|C2",
  "totalScore": 0-100の数値,
  "quality": "standard|advanced",
  "wordCount": 発話した単語数,
  "summary": "発話の要約（日本語）",
  "scores": [
    {"category": "流暢さ", "score": 0-100},
    {"category": "やりとり力", "score": 0-100},
    {"category": "文法", "score": 0-100},
    {"category": "語彙", "score": 0-100},
    {"category": "発音", "score": 0-100}
  ],
  "feedback": {
    "problematicPoints": "問題点の説明（日本語）",
    "strengths": "良かった点の説明（日本語）",
    "nextSteps": "具体的な改善提案（日本語）"
  },
  "vocabularyCards": [
    {
      "word": "英単語",
      "cefrLevel": "A1|A2|B1|B2|C1|C2",
      "meaning": "単語の意味（日本語）",
      "usage": "使用例（英語）"
    }
  ],
  "paraphrases": [
    {
      "original": "元の発話",
      "suggestion": "改善案"
    }
  ],
  "evaluationDetails": [
    {
      "category": "評価項目",
      "turnNumber": ターン番号,
      "transcript": "発話内容",
      "reason": "評価理由（日本語）"
    }
  ]
}

重要な点:
- CEFRレベルは正確に判定してください
- スコアは客観的に評価してください
- フィードバックは建設的で具体的にしてください
- 語彙カードは学習に役立つ重要な単語を選んでください
- 言い換え提案は文法的に正しく自然な表現にしてください
`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const result = await response.json();
  const analysisText = result.candidates[0]?.content?.parts[0]?.text;
  console.log(result);
  console.log("Gemini analysis text:", analysisText);

  const jsonMatch =
    analysisText.match(/```json\n([\s\S]*?)\n```/) ||
    analysisText.match(/(\{[\s\S]*\})/);

  if (!jsonMatch) {
    throw new Error("Gemini response does not contain valid JSON");
  }

  try {
    return JSON.parse(jsonMatch[1]);
  } catch (parseError) {
    console.error("JSON parse error:", parseError);
    throw new Error("Failed to parse Gemini response as JSON");
  }
}

export async function POST(request: NextRequest) {
  try {
    const { conversationId, userId, conversationMessages } =
      await request.json();

    if (!conversationId) {
      return NextResponse.json(
        { error: "conversationId is required" },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    let conversationData: ElevenLabsConversationData | null = null;
    let transcript: ConversationTurn[] = [];

    if (conversationMessages && conversationMessages.length > 0) {
      transcript = conversationMessages.map((msg: ConversationMessage) => ({
        speaker: msg.speaker.toLowerCase(),
        text: msg.text,
        timestamp: msg.timestamp,
      }));
    } else {
      conversationData = await getConversationFromElevenLabs(conversationId);
      transcript =
        conversationData?.turns?.map((turn: ConversationTurn) => ({
          speaker: turn.speaker,
          text: turn.text,
          timestamp: turn.timestamp,
        })) || [];
    }

    if (transcript.length === 0) {
      return NextResponse.json(
        { error: "No conversation data found" },
        { status: 400 }
      );
    }

    const analysisResult = await analyzeConversationWithGemini({
      turns: transcript,
    });

    const turns =
      conversationData?.turns?.map((turn: ConversationTurn, index: number) => ({
        turnNumber: index + 1,
        speaker: turn.speaker === "user" ? "CANDIDATE" : "EXAMINER",
        transcript: turn.text || "",
        timestamp: new Date(turn.timestamp || Date.now()),
      })) ||
      transcript.map((turn, index) => ({
        turnNumber: index + 1,
        speaker: turn.speaker === "candidate" ? "CANDIDATE" : "EXAMINER",
        transcript: turn.text || "",
        timestamp: new Date(turn.timestamp || Date.now()),
      }));

    // 4. データベースに保存
    console.log("Saving to database...");
    const test = await prisma.test.create({
      data: {
        userId: userId,
        cefrLevel: analysisResult.cefrLevel,
        totalScore: analysisResult.totalScore,
        quality: analysisResult.quality,
        wordCount: analysisResult.wordCount,
        summary: analysisResult.summary,

        // 関連データを同時作成
        turns: {
          create: turns,
        },
        scores: {
          create: analysisResult.scores,
        },
        feedback: {
          create: analysisResult.feedback,
        },
        vocabularyCards: {
          create: analysisResult.vocabularyCards || [],
        },
        paraphrases: {
          create: analysisResult.paraphrases || [],
        },
        EvaluationDetail: {
          create: analysisResult.evaluationDetails || [],
        },
      },
      include: {
        turns: true,
        scores: true,
        feedback: true,
        vocabularyCards: true,
        paraphrases: true,
        EvaluationDetail: true,
      },
    });

    console.log("Analysis completed successfully:", test.id);

    return NextResponse.json({
      success: true,
      testId: test.id,
      data: test,
    });
  } catch (error) {
    console.error("Error in conversation analysis:", error);

    return NextResponse.json(
      {
        error: "Failed to analyze conversation",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
