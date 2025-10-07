import ConversationStart from "../../components/conversationStart";
import Header from "../../components/header";

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4">
        <ConversationStart />
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            💡 Tips: Speak clearly and naturally. The AI will respond to help
            improve your English skills.
          </p>
        </div>
      </div>
    </div>
  );
}
