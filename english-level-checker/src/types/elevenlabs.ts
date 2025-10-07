// ElevenLabs分析結果の型定義
export interface CEFRAnalysis {
  cefrLevel: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  totalScore: number;
  quality: "standard" | "advanced";
  wordCount: number;
  summary: string;
  scores: Array<{
    category: string;
    score: number;
  }>;
  feedback: {
    strengths: string;
    problematicPoints: string;
    nextSteps: string;
  };
  vocabularyCards: Array<{
    word: string;
    cefrLevel: string;
    meaning: string;
    usage: string;
  }>;
  evaluationDetails: Array<{
    category: string;
    turnNumber: number;
    transcript: string;
    reason: string;
  }>;
}

// ElevenLabs Webhook イベント型
export interface ElevenLabsWebhookEvent {
  type: string;
  data: {
    conversation_id: string;
    user_id: string;
    transcript: Array<{
      role: string;
      message: string;
      time_in_call_secs: number;
    }>;
    analysis?: {
      data_collection_results?: {
        cefl_comprehensive_analysis?: {
          value: string;
        };
      };
    };
  };
}
