"use client";

import { useConversation } from "@elevenlabs/react";
import { useCallback, useState, useEffect, useRef } from "react";
import { analyzeConversation } from "../graphql/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ConversationMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

// ElevenLabs メッセージ型定義
interface ElevenLabsMessage {
  source?: string;
  message?: string;
  content?: string;
  text?: string;
  type?: string;
  [key: string]: unknown;
}

// セッション結果型定義
interface SessionResult {
  conversationId?: string;
  [key: string]: unknown;
}

export function Conversation() {
  const router = useRouter();
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0); // タイマーの残り時間（秒）
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false); // 分析中の状態
  const [analysisError, setAnalysisError] = useState<string | null>(null); // 分析エラー
  const [conversationId, setConversationId] = useState<string | null>(null); // 会話ID
  const [isConversationEnded, setIsConversationEnded] = useState(false); // 会話終了フラグ
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const CONVERSATION_DURATION = 10;

  // デバッグ用：メッセージの変化を監視
  useEffect(() => {
    console.log("Messages updated:", messages.length, messages);
  }, [messages]);

  // 会話分析処理
  const handleConversationAnalysis = useCallback(async () => {
    if (!conversationId) {
      console.error("Conversation ID not found");
      setAnalysisError("会話IDが見つかりません");
      return;
    }

    try {
      setIsAnalyzing(true);
      setAnalysisError(null);

      console.log("=== Starting Conversation Analysis ===");
      console.log(`Conversation ID: ${conversationId}`);
      console.log(`Total messages: ${messages.length}`);

      // 仮のユーザーID（実際の実装では認証されたユーザーIDを使用）
      const userId = 1;

      // フロントエンドで収集した会話データも一緒に送信
      const conversationMessages = messages.map((msg, index) => ({
        turnNumber: index + 1,
        speaker: msg.role === "user" ? "CANDIDATE" : "EXAMINER",
        text: msg.content,
        timestamp: msg.timestamp.toISOString(),
      }));

      console.log("Sending conversation data:", conversationMessages);
      console.log(conversationId, userId, conversationMessages);

      const analysisResult = await analyzeConversation(
        conversationId,
        userId,
        conversationMessages
      );
      console.log("Analysis result:", analysisResult);
      console.log("Step 4: Analysis completed successfully!");
      console.log(`Test ID: ${analysisResult.testId}`);

      // Step 4: 完了フェーズ
      console.log("Step 5: Redirecting to results page...");
      await new Promise((resolve) => setTimeout(resolve, 500));

      console.log("Step 5: Redirecting to results page...");
      // 分析完了後、結果ページにリダイレクト
      router.push(`/history/${analysisResult.testId}`);
    } catch (error) {
      console.error("=== Analysis Failed ===");
      console.error("Error details:", error);
      setAnalysisError(
        error instanceof Error ? error.message : "分析に失敗しました"
      );
      setIsAnalyzing(false);
    }
  }, [conversationId, router, messages]);

  const conversation = useConversation({
    onConnect: () => {
      console.log("Connected");
      // タイマーを開始
      startTimer();
      // 接続時に歓迎メッセージを追加
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content:
            "Hello! I'm your English conversation partner. How are you today?",
          timestamp: new Date(),
        },
      ]);
    },
    onDisconnect: async () => {
      console.log("=== Conversation Disconnected ===");

      // Step 1: タイマー停止と状態リセット
      stopTimer();
      setIsTranscribing(false);
      setIsConversationEnded(true);

      // Step 1: 会話分析の前提条件チェック
      console.log("Step 1: Checking analysis prerequisites...");

      if (!conversationId) {
        console.log("❌ No conversation ID found");
        return;
      }

      if (messages.length <= 1) {
        console.log("❌ Insufficient messages for analysis");
        return;
      }

      if (isAnalyzing) {
        console.log("❌ Analysis already in progress");
        return;
      }

      const userMessages = messages.filter((msg) => msg.role === "user");
      const assistantMessages = messages.filter(
        (msg) => msg.role === "assistant"
      );

      if (userMessages.length === 0 || assistantMessages.length === 0) {
        console.log("❌ Missing user or assistant messages");
        console.log(
          `User messages: ${userMessages.length}, Assistant messages: ${assistantMessages.length}`
        );
        return;
      }

      // Step 3: 分析開始
      console.log("✅ All prerequisites met, starting analysis...");
      console.log(
        `User messages: ${userMessages.length}, Assistant messages: ${assistantMessages.length}`
      );

      // 少し遅延を入れて確実に状態が更新されるようにする
      setTimeout(async () => {
        await handleConversationAnalysis();
      }, 500);
    },
    onMessage: (message) => {
      if (message && typeof message === "object") {
        const msg = message as ElevenLabsMessage;
        if (message.source === "user" || msg.type === "user_transcript") {
          const content = message.message || msg.content || msg.text || "";
          if (content) {
            console.log("Adding user message:", content);
            setMessages((prev) => [
              ...prev,
              {
                id: Date.now().toString(),
                role: "user",
                content: content,
                timestamp: new Date(),
              },
            ]);
          }
          setIsTranscribing(false);
        } else if (message.source === "ai" || msg.type === "agent_response") {
          const content = message.message || msg.content || msg.text || "";
          if (content) {
            console.log("Adding assistant message:", content);
            setMessages((prev) => [
              ...prev,
              {
                id: Date.now().toString(),
                role: "assistant",
                content: content,
                timestamp: new Date(),
              },
            ]);
          }
        }
      }
    },
    onError: (error) => {
      console.error("Error:", error);
    },
    onModeChange: (mode) => {
      if (mode && mode.mode === "listening") {
        setIsTranscribing(true);
      } else {
        setIsTranscribing(false);
      }
    },
  });

  const startTimer = useCallback(() => {
    setRemainingTime(CONVERSATION_DURATION);
    setIsTimerActive(true);

    timerRef.current = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          console.log("Timer ended - ending conversation session");
          setIsTimerActive(false);
          if (conversation.endSession) {
            conversation.endSession();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [conversation]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsTimerActive(false);
    setRemainingTime(0);
  }, []);

  // タイマーの表示形式を整える関数
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // 会話開始関数
  const startConversation = useCallback(async () => {
    try {
      const agentId = process.env.NEXT_PUBLIC_AGENT_ID;
      if (!agentId) {
        console.error("NEXT_PUBLIC_AGENT_ID is not defined");
        return;
      }

      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // Clear previous messages
      setMessages([]);

      // Start the conversation with your agent
      const sessionResult = await conversation.startSession({
        agentId: agentId,
        userId: "english_learner_" + Date.now(),
        connectionType: "webrtc",
      });

      console.log("Session result:", sessionResult);
      if (typeof sessionResult === "string") {
        setConversationId(sessionResult);
      } else if (sessionResult && typeof sessionResult === "object") {
        const result = sessionResult as SessionResult;
        if (result.conversationId) {
          setConversationId(result.conversationId);
        }
      }
    } catch (error) {
      console.error("Failed to start conversation:", error);
    }
  }, [conversation]);

  // コンポーネントマウント時に自動で会話開始
  useEffect(() => {
    startConversation();
  }, [startConversation]);

  // コンポーネントがアンマウントされる時にタイマーをクリア
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      {/* Status Display */}
      <div className="flex flex-col gap-4 p-6 bg-white rounded-lg shadow-lg">
        <div className="flex flex-col items-center gap-2 text-sm">
          <div
            className={`px-3 py-1 rounded-full ${
              conversation.status === "connected"
                ? "bg-green-100 text-green-800"
                : conversation.status === "connecting"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            Status: {conversation.status}
          </div>

          {/* タイマー表示 */}
          {isTimerActive && (
            <div
              className={`px-4 py-2 rounded-full font-mono text-lg font-bold ${
                remainingTime <= 30
                  ? "bg-red-100 text-red-800 border-2 border-red-300"
                  : remainingTime <= 60
                  ? "bg-yellow-100 text-yellow-800 border-2 border-yellow-300"
                  : "bg-blue-100 text-blue-800 border-2 border-blue-300"
              }`}
            >
              ⏱️ {formatTime(remainingTime)}
            </div>
          )}

          {conversation.status === "connected" && (
            <div
              className={`px-3 py-1 rounded-full ${
                conversation.isSpeaking
                  ? "bg-blue-100 text-blue-800"
                  : isTranscribing
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {conversation.isSpeaking
                ? "🎤 AI is speaking..."
                : isTranscribing
                ? "👂 Listening to you..."
                : "🎯 Ready to listen"}
            </div>
          )}
        </div>
      </div>

      {/* タイマー終了後または会話終了後の履歴誘導UI */}
      {((!isTimerActive && remainingTime === 0) || isConversationEnded) &&
        conversation.status === "disconnected" &&
        messages.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            {isAnalyzing ? (
              <>
                <div className="text-4xl mb-4">🔄</div>
                <h3 className="text-xl font-bold text-blue-900 mb-2">
                  会話を分析中...
                </h3>
                <p className="text-blue-700 mb-6">
                  AIがあなたの会話を分析しています。少々お待ちください。
                </p>
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
                <p className="text-blue-600 text-sm font-medium mt-4">
                  分析が完了したら自動的に結果画面に移動します
                </p>
              </>
            ) : (
              <>
                <div className="text-4xl mb-4">🎉</div>
                <h3 className="text-xl font-bold text-blue-900 mb-2">
                  お疲れ様でした！
                </h3>
                <p className="text-blue-700 mb-4">
                  2分間の英会話練習が完了しました。履歴で今回の会話を確認してみましょう。
                </p>
                {analysisError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-red-500">⚠️</span>
                      <h4 className="text-red-800 font-semibold">
                        分析エラーが発生しました
                      </h4>
                    </div>
                    <p className="text-red-700 text-sm mb-3">{analysisError}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleConversationAnalysis()}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors flex items-center gap-2"
                        disabled={isAnalyzing}
                      >
                        {isAnalyzing ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border-b border-white"></div>
                            再分析中...
                          </>
                        ) : (
                          <>🔄 再分析</>
                        )}
                      </button>
                      <Link
                        href="/history"
                        className="bg-gray-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-600 transition-colors"
                      >
                        後で分析
                      </Link>
                    </div>
                  </div>
                )}
                <Link
                  href="/history"
                  className="inline-block bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  履歴を確認する
                </Link>
              </>
            )}
          </div>
        )}

      {/* Conversation Display */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gray-50 px-6 py-3 border-b">
          <h3 className="text-lg font-semibold text-gray-800">
            English Conversation Chat
          </h3>
          <p className="text-sm text-gray-600">
            {messages.length} messages • Practice your English speaking skills
          </p>
        </div>

        <div className="h-96 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <div className="text-4xl mb-4">🎙️</div>

              <>
                <p className="text-lg">
                  {conversation.status === "connecting"
                    ? "🔄 接続中... マイクの許可をお待ちしています"
                    : conversation.status === "connected"
                    ? "💬 会話が始まります！"
                    : "🚀 準備中..."}
                </p>
                <p className="text-sm mt-2">10秒間の英会話練習です！</p>
              </>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                    message.role === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium">
                      {message.role === "user" ? "👤 You" : "🤖 AI Teacher"}
                    </span>
                    <span className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
              </div>
            ))
          )}

          {/* Transcription indicator */}
          {isTranscribing && (
            <div className="flex justify-end">
              <div className="max-w-xs lg:max-w-md px-4 py-3 rounded-lg bg-blue-100 border-2 border-blue-300">
                <div className="flex items-center gap-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                  <span className="text-sm text-blue-700">Speaking...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
