"use client";

import { useState } from "react";
import { Conversation } from "./conversation";

export default function ConversationStart() {
  const [hasStarted, setHasStarted] = useState(false);

  const handleStart = () => {
    setHasStarted(true);
  };

  if (hasStarted) {
    return <Conversation />;
  }
  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      <main className="px-6 py-16 sm:py-20 flex flex-col items-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            2分英語で話してみましょう
          </h2>

          <div className="mt-8">
            <button
              onClick={handleStart}
              className="bg-blue-600 text-white font-semibold py-2 px-8 rounded-lg hover:bg-blue-700 transition-colors shadow"
            >
              開始
            </button>
          </div>
        </div>

        <div className="mt-8 w-full max-w-3xl bg-white border border-gray-200/90 rounded-xl p-8 shadow-sm">
          <p className="text-gray-700 leading-relaxed">
            かしこまらず、気軽に英会話を楽しみましょう。完璧さよりも「伝わること」を大切に。
          </p>

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800">
              気楽に話すコツ
            </h3>
            <ul className="mt-4 space-y-2 list-disc list-inside text-gray-600">
              <li>短くてOK ー文法ずくめでゆっくり話せば十分です。</li>
              <li>間違いを恐れない・伝わればOK。文法の完璧さは求めません。</li>
              <li>
                詰まったら聞き返す・&quot;Could you say that again?&quot; /
                &quot;Please rephrase.&quot;
              </li>
              <li>
                相づちを使う・&quot;Uh-huh&quot;, &quot;I see&quot;,
                &quot;That&apos;s interesting.&quot; など。
              </li>
              <li>深掘りの一言・Why? / How? を添えると会話が広がります。</li>
            </ul>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-800">
              進行イメージ
            </h3>
            <ul className="mt-4 space-y-2 list-disc list-inside text-gray-600">
              <li>はじめに話題を選択（旅行・仕事学習・趣味）。</li>
              <li>ウォームアップ→トピック会話→ちょっと深掘り→まとめ。</li>
              <li>
                困ったら、後半に「二択で聞いて」「やさしく言い換えて」などのヒントが出ます。
              </li>
              <li>2分で自動終了、終わると振り返りレポートが表示されます。</li>
            </ul>
          </div>

          <p className="mt-8 text-sm text-gray-500">
            環境のコツ:
            静かな場所で、マイクに向かってはっきり話すと聞き取りやすくなります。
          </p>
        </div>
      </main>
    </div>
  );
}
