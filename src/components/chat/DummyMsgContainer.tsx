import { Send } from "lucide-react";
import React from "react";

function DummyMsgContainer() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <Send className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Start a conversation
        </h3>
        <p className="text-gray-500">Send a message to begin chatting</p>
      </div>
    </div>
  );
}

export default DummyMsgContainer;
