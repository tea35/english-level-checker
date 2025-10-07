"use client";

import Header from "../../../components/header";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getTest, TestDetail } from "../../../graphql/client";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

export default function TestDetailPage() {
  const params = useParams();
  const [test, setTest] = useState<TestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTestDetail = async () => {
      try {
        const testData = await getTest(parseInt(params.id as string));
        console.log("Test detail fetched:", testData);
        setTest(testData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "エラーが発生しました");
        console.error("Failed to fetch test detail:", err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchTestDetail();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">読み込み中...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !test) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-red-500 text-xl mb-4">⚠️ エラー</div>
            <p className="text-gray-600 mb-4">
              {error || "テストデータが見つかりません"}
            </p>
            <Link href="/history" className="text-blue-600 hover:text-blue-800">
              履歴一覧に戻る
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getCEFRColor = (level: string) => {
    if (level === "A1" || level === "A2") return "bg-red-100 text-red-800";
    if (level === "B1" || level === "B2")
      return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  const getLevelDescription = (level: string) => {
    const descriptions: { [key: string]: string } = {
      A1: "入門",
      A2: "初級",
      B1: "中級前半",
      B2: "中級後半",
      C1: "上級",
      C2: "熟達",
    };
    return descriptions[level] || level;
  };

  const getLevelExplanation = (level: string) => {
    const explanations: { [key: string]: string } = {
      A1: "基本的な表現や簡単な文章を理解し、使うことができるレベルです。",
      A2: "日常的な話題なら簡単なやり取りができるレベルです。",
      B1: "身近な話題について明確で標準的な表現であれば要点を理解できるレベルです。",
      B2: "複雑な文章の要点を理解し、幅広い話題について明確で詳細な文章を作ることができるレベルです。",
      C1: "長く複雑な文章を理解し、目的に適した適切で効果的な言語を使うことができるレベルです。",
      C2: "聞いたり読んだりした内容を要約し、論理的で一貫した方法で話したり書いたりできるレベルです。",
    };
    return explanations[level] || "レベル情報が見つかりません。";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* ヘッダー */}
        <div className="mb-8">
          <Link
            href="/history"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
          >
            ← 履歴一覧に戻る
          </Link>

          {/* 英語レベル表示セクション */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              あなたの英語レベル: {test.cefrLevel}
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              あなたは「{test.cefrLevel}（{getLevelDescription(test.cefrLevel)}
              ）」: {getLevelExplanation(test.cefrLevel)}
            </p>

            {/* CEFRレベル表示 */}
            <div className="max-w-4xl mx-auto">
              <div className="text-sm text-gray-500 mb-4">CEFR レベル</div>
              <div className="flex justify-center gap-2 mb-4">
                {["A1", "A2", "B1", "B2", "C1", "C2"].map((level, index) => {
                  const currentLevelIndex = [
                    "A1",
                    "A2",
                    "B1",
                    "B2",
                    "C1",
                    "C2",
                  ].indexOf(test.cefrLevel);
                  const isCurrentLevel = level === test.cefrLevel;
                  const isAchieved = index <= currentLevelIndex;

                  return (
                    <div key={level} className="text-center flex-1 max-w-36">
                      <div
                        className={`w-full h-16 rounded-lg flex items-center justify-center text-white font-bold text-lg mb-2 transition-all duration-300 ${
                          isCurrentLevel
                            ? "bg-green-500 shadow-lg scale-110"
                            : isAchieved
                            ? "bg-green-200"
                            : "bg-gray-200"
                        }`}
                      >
                        {level}
                        {isCurrentLevel && (
                          <div className="ml-2">
                            <div className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-white"></div>
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-gray-600">
                        {getLevelDescription(level)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* メインコンテンツ */}
          <div className="lg:col-span-2 space-y-8">
            {/* 要約 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                📝 総合評価
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* 総合スコア円形プログレスチャート */}
                <div className="flex flex-col items-center justify-center">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    総合スコア
                  </h3>

                  {/* 円形プログレスバー */}
                  <div className="relative w-40 h-40">
                    <svg
                      className="w-full h-full transform -rotate-90"
                      viewBox="0 0 100 100"
                    >
                      {/* 背景の円 */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="hsl(var(--muted))"
                        strokeWidth="8"
                        strokeLinecap="round"
                      />
                      {/* プログレス円 */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="hsl(var(--chart-1))"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${
                          (test.totalScore / 100) * 251.2
                        } 251.2`}
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    {/* 中央のテキスト */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="text-3xl font-bold text-gray-900">
                        {Math.round(test.totalScore)}%
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {test.totalScore.toFixed(1)} / 100
                      </div>
                    </div>
                  </div>
                </div>

                {/* 詳細情報 */}
                <div className="flex flex-col justify-center">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-gray-600">単語数</div>
                        <div className="font-semibold text-lg">
                          {test.wordCount}
                        </div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-gray-600">発話回数</div>
                        <div className="font-semibold text-lg">
                          {
                            test.turns.filter((t) => t.speaker === "CANDIDATE")
                              .length
                          }
                        </div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg sm:col-span-2">
                        <div className="text-gray-600">品質</div>
                        <div className="font-semibold text-lg">
                          {test.quality}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-900 mb-2">
                  評価コメント
                </h4>
                <p className="text-gray-700 leading-relaxed">{test.summary}</p>
              </div>
            </div>

            {/* 会話履歴 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                💬 会話履歴
              </h2>
              <div className="space-y-4">
                {test.turns.map((turn) => (
                  <div
                    key={turn.id}
                    className={`flex ${
                      turn.speaker === "CANDIDATE"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                        turn.speaker === "CANDIDATE"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium">
                          {turn.speaker === "CANDIDATE"
                            ? "👤 You"
                            : "🤖 Examiner"}
                        </span>
                        <span className="text-xs opacity-70">
                          {new Date(turn.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed">
                        {turn.transcript}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* フィードバック */}
            {test.feedback && test.feedback.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  💡 詳細フィードバック
                </h2>

                <div className="space-y-4">
                  <div className="border-l-4 border-green-400 pl-4">
                    <h3 className="font-semibold text-green-800 mb-2">
                      ✅ 良かった点
                    </h3>
                    <p className="text-gray-700">
                      {test.feedback[0].strengths}
                    </p>
                  </div>

                  <div className="border-l-4 border-yellow-400 pl-4">
                    <h3 className="font-semibold text-yellow-800 mb-2">
                      ⚠️ 改善点
                    </h3>
                    <p className="text-gray-700">
                      {test.feedback[0].problematicPoints}
                    </p>
                  </div>

                  <div className="border-l-4 border-blue-400 pl-4">
                    <h3 className="font-semibold text-blue-800 mb-2">
                      🎯 次のステップ
                    </h3>
                    <p className="text-gray-700">
                      {test.feedback[0].nextSteps}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 言い換え提案 */}
            {test.paraphrases && test.paraphrases.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  🔄 言い換え提案
                </h2>
                <div className="space-y-4">
                  {test.paraphrases.map((paraphrase, index) => (
                    <div
                      key={`paraphrase-${index}`}
                      className="border rounded-lg p-4 bg-gray-50"
                    >
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm font-medium text-red-600">
                            ❌ 元の発話:{" "}
                          </span>
                          <span className="text-red-700">
                            {paraphrase.original}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-green-600">
                            ✅ 修正案:{" "}
                          </span>
                          <span className="text-green-700">
                            {paraphrase.suggestion}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* サイドバー */}
          <div className="space-y-8">
            {/* スコア詳細 */}

            {/* スコア詳細 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6 text-center">
                📊 項目別スコア
              </h3>
              <ChartContainer
                config={{
                  score: {
                    label: "スコア",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="mx-auto aspect-square max-h-[400px]"
              >
                <RadarChart
                  data={[
                    {
                      subject: "流暢さ",
                      score:
                        test.scores.find((s) => s.category.includes("Fluency"))
                          ?.score ||
                        test.scores[0]?.score ||
                        0,
                    },
                    {
                      subject: "やりとり力",
                      score:
                        test.scores.find((s) =>
                          s.category.includes("Interactive")
                        )?.score ||
                        test.scores[1]?.score ||
                        0,
                    },
                    {
                      subject: "文法",
                      score:
                        test.scores.find((s) => s.category.includes("Grammar"))
                          ?.score ||
                        test.scores[2]?.score ||
                        0,
                    },
                    {
                      subject: "語彙",
                      score:
                        test.scores.find((s) =>
                          s.category.includes("Vocabulary")
                        )?.score ||
                        test.scores[3]?.score ||
                        0,
                    },
                    {
                      subject: "発音",
                      score:
                        test.scores.find((s) =>
                          s.category.includes("Pronunciation")
                        )?.score ||
                        test.scores[4]?.score ||
                        0,
                    },
                  ]}
                  margin={{ top: 40, right: 80, bottom: 40, left: 80 }}
                >
                  <PolarGrid gridType="polygon" />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 10]}
                    tick={false}
                    axisLine={false}
                  />
                  <Radar
                    name="スコア"
                    dataKey="score"
                    stroke="hsl(var(--chart-1))"
                    fill="hsl(var(--chart-1))"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <ChartTooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-3 border rounded-lg shadow-lg">
                            <p className="font-medium">{label}</p>
                            <p className="text-blue-600">
                              スコア: {payload[0].value}%
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </RadarChart>
              </ChartContainer>
            </div>

            {/* 語彙カード */}
            {test.vocabularyCards.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  📚 重要語彙
                </h2>
                <div className="space-y-4">
                  {test.vocabularyCards.map((card, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-4 bg-blue-50"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg text-blue-900">
                          {card.word}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded text-xs font-bold ${getCEFRColor(
                            card.cefrLevel
                          )}`}
                        >
                          {card.cefrLevel}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-2">{card.meaning}</p>
                      <p className="text-sm text-gray-600 italic">
                        例: {card.usage}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 評価詳細 */}
            {test.evaluationDetails.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  🔍 評価の根拠
                </h2>
                <div className="space-y-4">
                  {test.evaluationDetails.map((detail, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-medium text-blue-600">
                          {detail.category}
                        </span>
                        <span className="text-xs text-gray-500">
                          ターン {detail.turnNumber}
                        </span>
                      </div>
                      <p className="text-sm text-gray-800 mb-2 font-mono bg-gray-100 p-2 rounded">
                        &quot;{detail.transcript}&quot;
                      </p>
                      <p className="text-sm text-gray-600">{detail.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* アクションボタン */}
        <div className="mt-8 text-center space-x-4">
          <Link
            href="/chat"
            className="inline-block bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
          >
            新しい会話を始める
          </Link>
          <Link
            href="/history"
            className="inline-block bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors"
          >
            履歴一覧に戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
