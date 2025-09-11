import { Paperclip, Send, Smile } from "lucide-react";
import React, {  SetStateAction } from "react";

interface messaegInputProps {
    setInput: (value: SetStateAction<string>) => void;
    input:string,
    handleKeyPress: (e: React.KeyboardEvent) => void,
    sendMessage: () => void
}

function MessageInput({setInput,input,handleKeyPress,sendMessage}:messaegInputProps) {
  return (
    <div className="bg-gray-900 border-t border-gray-500 px-4 py-4 fixed bottom-0 width">
      <div className="flex items-center space-x-3">
        <div className="flex-1">
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type a message..."
              rows={1}
              className="w-full px-4 py-3 pr-12 bg-gray-100 rounded-full resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-colors"
              style={{
                minHeight: "48px",
                maxHeight: "120px",
              }}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
              <Smile className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600" />
              <Paperclip className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600" />
            </div>
          </div>
        </div>
        <button
          onClick={sendMessage}
          disabled={!input.trim()}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
            input.trim()
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export default MessageInput;
