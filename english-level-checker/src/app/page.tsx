// src/components/EnglishLevelCheckerPage.tsx

import React from "react";
import Link from "next/link";
import Header from "../components/header";

// 型定義
type ButtonProps = {
  children: React.ReactNode;
  href?: string;
};

type FeatureTagProps = {
  children: React.ReactNode;
};

type ProcessStepProps = {
  number: number;
  title: string;
  description: string;
};

type ReportItemProps = {
  title: string;
  description?: string;
  children?: React.ReactNode;
  color?: string;
};

// 小さなコンポーネントを内部で定義してコードを整理します

// 中央の青いボタンと白いボタン
const PrimaryButton: React.FC<ButtonProps> = ({ children, href }) => {
  if (href) {
    return (
      <Link
        href={href}
        className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors shadow inline-block"
      >
        {children}
      </Link>
    );
  }
  return (
    <button className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors shadow">
      {children}
    </button>
  );
};

const SecondaryButton: React.FC<ButtonProps> = ({ children, href }) => {
  if (href) {
    return (
      <Link
        href={href}
        className="bg-white text-gray-700 font-semibold py-2 px-6 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors shadow-sm inline-block"
      >
        {children}
      </Link>
    );
  }
  return (
    <button className="bg-white text-gray-700 font-semibold py-2 px-6 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors shadow-sm">
      {children}
    </button>
  );
};

// 特徴を示すタグ
const FeatureTag: React.FC<FeatureTagProps> = ({ children }) => (
  <div className="bg-white border border-gray-200 rounded-full px-4 py-1.5 text-sm text-gray-700 shadow-sm">
    {children}
  </div>
);

// 「会話の流れ」の各ステップ
const ProcessStep: React.FC<ProcessStepProps> = ({
  number,
  title,
  description,
}) => (
  <div className="flex items-start space-x-4">
    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-700 font-bold rounded-full">
      {number}
    </div>
    <div>
      <h3 className="font-semibold text-gray-800">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  </div>
);

// 「レポートでわかること」の各項目
const ReportItem: React.FC<ReportItemProps> = ({
  title,
  description,
  children,
  color = "bg-blue-500",
}) => (
  <div className="bg-slate-100/60 border border-gray-200/80 rounded-lg p-3">
    <div className="flex items-start space-x-2.5">
      <div
        className={`w-2 h-2 ${color} rounded-full mt-1.5 flex-shrink-0`}
      ></div>
      <div>
        <h4 className="font-semibold text-sm text-gray-800">{title}</h4>
        {(description || children) && (
          <p className="text-xs text-gray-500">{description || children}</p>
        )}
      </div>
    </div>
  </div>
);

// メインのページコンポーネント
export const EnglishLevelCheckerPage: React.FC = () => {
  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      {/* ヘッダー */}
      <Header />

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        {/* ヒーローセクション */}
        <section className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            あなたの英語力、2分で診断
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-gray-600">
            ウォームアップ→トピック選択→深掘り→締めの流れで短い会話を行い、会話内容から英語レベルを分析。国際基準に基づく判定と、今の強み・次に伸ばすポイントがひと目でわかります。
          </p>
          <div className="mt-8 flex justify-center items-center space-x-4">
            <PrimaryButton href="/chat">会話をはじめる</PrimaryButton>
            <SecondaryButton href="/history">履歴を見る</SecondaryButton>
          </div>
        </section>

        {/* 特徴タグ */}
        <section className="mt-12 flex justify-center flex-wrap gap-3">
          <FeatureTag>CEFR準拠の評価</FeatureTag>
          <FeatureTag>音声AIとの自然対話</FeatureTag>
          <FeatureTag>2分で結果が出る</FeatureTag>
          <FeatureTag>強みと次の一歩を可視化</FeatureTag>
        </section>

        {/* 詳細セクション */}
        <section className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左側: 会話の流れ */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">会話の流れ</h2>
            <div className="space-y-6">
              <ProcessStep
                number={1}
                title="ウォームアップ"
                description="簡単な自己紹介や近況からスタート"
              />
              <ProcessStep
                number={2}
                title="トピック選択"
                description="旅行・仕事学習・趣味などから選択"
              />
              <ProcessStep
                number={3}
                title="深掘り"
                description="Why/Howを添えて会話を広げる"
              />
              <ProcessStep
                number={4}
                title="まとめ & レポート"
                description="自動で評価し、結果をわかりやすく提示"
              />
            </div>
          </div>

          {/* 右側: レポートでわかること */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              レポートでわかること
            </h2>

            {/* レベル・評価 */}
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                レベル・評価
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ReportItem
                  title="総合レベル"
                  description="CEFR A1-C2と短い説明"
                />
                <ReportItem
                  title="5軸評価"
                  description="流暢さ・やりとり力・文法・語彙・発音（レーダー＋各バー）"
                />
              </div>
            </div>

            {/* 振り返り・改善 */}
            <div className="mt-6">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                振り返り・改善
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ReportItem
                  title="要約"
                  description="会話全体の振り返りと到達点"
                  color="bg-green-500"
                />
                <ReportItem
                  title="良かった点"
                  description="強みが伝わる具体的な観点"
                  color="bg-green-500"
                />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4">
              <ReportItem
                title="次の一歩"
                description="すぐ実践できる練習ポイント"
                color="bg-green-500"
              />
            </div>

            {/* 根拠・学習教材 */}
            <div className="mt-6">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                根拠・学習教材
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ReportItem
                  title="根拠"
                  description="評価に使われた英語の引用と理由"
                  color="bg-purple-500"
                />
                <ReportItem
                  title="言い換え提案"
                  description="より自然で伝わる表現の候補"
                  color="bg-purple-500"
                />
                <ReportItem
                  title="語彙カード"
                  description="新出語・表現と簡単なメモ"
                  color="bg-purple-500"
                />
                <ReportItem
                  title="メタ情報"
                  description="品質、発話回数、単語数など"
                  color="bg-purple-500"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default EnglishLevelCheckerPage;
