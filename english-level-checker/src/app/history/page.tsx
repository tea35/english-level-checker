"use client";

import React, { useEffect, useState } from "react";
import Header from "../../components/header";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getTests, TestListItem } from "../../graphql/client";

export default function HistoryPage() {
  const router = useRouter();
  const [tests, setTests] = useState<TestListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    totalCount: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });

  // パラメータを変数として定義
  const currentUserId = getCurrentUserId(); // ユーザーID取得関数
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = getItemsPerPage(); // 設定から取得

  useEffect(() => {
    const fetchTests = async () => {
      try {
        setLoading(true);
        const result = await getTests(currentUserId, currentPage, itemsPerPage);
        console.log("Tests fetched:", result);
        setTests(result.tests);
        setPagination(result.pagination);
      } catch (error) {
        console.error("Failed to fetch tests:", error);
        setTests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, [currentPage]);

  // ページ変更ハンドラー
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // 行クリックハンドラー
  const handleRowClick = (testId: number) => {
    router.push(`/history/${testId}`);
  };

  // キーボード操作ハンドラー
  const handleRowKeyDown = (event: React.KeyboardEvent, testId: number) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleRowClick(testId);
    }
  };

  // ユーザーID取得関数（実際の実装では認証コンテキストから取得）
  function getCurrentUserId(): number {
    // TODO: 認証システムから現在のユーザーIDを取得
    // 例: const { user } = useAuth(); return user.id;
    return 1; // 暫定値
  }

  // ページあたりのアイテム数を取得（設定または環境変数から）
  function getItemsPerPage(): number {
    // 環境変数から取得、デフォルトは10
    return parseInt(process.env.NEXT_PUBLIC_ITEMS_PER_PAGE || "10");
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "A1":
      case "A2":
        return "text-red-600 bg-red-50 border border-red-200";
      case "B1":
      case "B2":
        return "text-yellow-600 bg-yellow-50 border border-yellow-200";
      case "C1":
      case "C2":
        return "text-green-600 bg-green-50 border border-green-200";
      default:
        return "text-gray-600 bg-gray-50 border border-gray-200";
    }
  };

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

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">履歴</h1>

        {tests.length === 0 ? (
          /* 履歴がない場合の表示 */
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="text-6xl mb-6">📚</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              まだ会話履歴がありません
            </h2>
            <p className="text-gray-600 mb-8">
              初めての英会話セッションを始めて、あなたの成長を記録しましょう！
            </p>
            <Link
              href="/chat"
              className="inline-block bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
            >
              会話を始める
            </Link>
          </div>
        ) : (
          /* 履歴テーブル表示 */
          <div className="bg-white border border-gray-200/90 rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-left">
              {/* Table Header */}
              <thead>
                <tr className="bg-slate-50/70">
                  <th className="p-4 text-sm font-semibold text-gray-600 border-b border-gray-200">
                    日時
                  </th>
                  <th className="p-4 text-sm font-semibold text-gray-600 border-b border-gray-200">
                    レベル
                  </th>
                  <th className="p-4 text-sm font-semibold text-gray-600 border-b border-gray-200">
                    総合
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {tests.map((item, index) => (
                  <tr
                    key={item.id}
                    onClick={() => handleRowClick(item.id)}
                    onKeyDown={(e) => handleRowKeyDown(e, item.id)}
                    tabIndex={0}
                    role="button"
                    aria-label={`テスト詳細を表示: ${item.dateTime}, レベル ${item.level}, スコア ${item.score}`}
                    className="border-b border-gray-200 last:border-b-0 hover:bg-blue-50/50 focus:bg-blue-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset transition-colors cursor-pointer group"
                  >
                    <td className="p-4 text-gray-800">{item.dateTime}</td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getLevelColor(
                          item.level
                        )}`}
                      >
                        {item.level}
                      </span>
                    </td>
                    <td className="p-4 text-gray-800 font-semibold">
                      {item.score}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 新しい会話を始めるボタン */}
        {tests.length > 0 && (
          <div className="mt-8 space-y-4">
            {/* ページネーション */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!pagination.hasPrev}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  前へ
                </button>

                <span className="px-3 py-2 text-sm text-gray-700">
                  {currentPage} / {pagination.totalPages} ページ （全{" "}
                  {pagination.totalCount} 件）
                </span>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!pagination.hasNext}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  次へ
                </button>
              </div>
            )}

            {/* 新しい会話ボタン */}
            <div className="text-center">
              <Link
                href="/chat"
                className="inline-block bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
              >
                新しい会話を始める
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
