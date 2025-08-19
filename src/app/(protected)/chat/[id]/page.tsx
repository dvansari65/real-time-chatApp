"use client";
import { useState, useEffect, useRef } from "react";
import { Send, Smile, Paperclip } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import { useSocket } from "@/utils/SocketProvider";
import { useAuth } from "@/contextApi";
import { useSingleUser as useGetSingleUser} from "@/lib/api/getSingleUser";
import { useGetChat } from "@/lib/api/useGetchat";
import { LoadingDots } from "@/components/ui/ThreeDotsLoader";
import ChatHeader from "@/components/chat/chatHeader";
import { useJoinChat } from "@/hooks/useJoinRoom";
import MessageContainer from "@/components/ui/MessageContainer";
import { messageStatus } from "@/types/message";
import { useChatCreation } from "@/hooks/useCreateChat";


export default function Conversation() {
  const params = useParams();
  const chatId = params.id;
  const searchParams = useSearchParams();
  const userId = searchParams.get("with");
  // const [messageStatus,setMessageStatus] = useState<>("SENT")
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");

  const socket = useSocket();
  const { data } = useAuth();
  const user = data?.user;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    data: singleUserData,
    isLoading: singleUserLoading
  } = useGetSingleUser(Number(userId));

  const { 
    data: chatData,
    isLoading: chatLoading
  } = useGetChat(Number(chatId));

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useJoinChat(Number(chatId), Number(user?.id));

  useEffect(() => {
    if (!socket) return;

    socket.on("connect", () => {
      console.log("socket connected!");
      if (user) {
        socket.emit("user_authentication", {
          userId: user?.id,
          username: user?.username,
        });
      }
    });

    socket.on("new-message", (data: any) => {
      console.log("data", data);
      setMessages((prev) => [...prev, data.message]);
    });

    return () => {
      socket.off("connect");
      socket.off("new-message");
    };
  }, [socket, user?.id, user?.username]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
    }
  };
  const sendMessage = () => {
    const messagePayload = {
      content: input.trim(),
      senderId: user?.id,
      chatId: Number(chatId),
      type: "TEXT",
      replyToId: null,
    };
    setMessages((prev) => [...prev, messagePayload]);
   
    // socket.emit("send-message");
    if (socket && socket.connected) {
      socket.emit("send-message", messagePayload);
    } else {
      socket.once("connect", () => {
        socket.emit("send-message", messagePayload);
      });
    }
    setInput("");
  };
  const {authLoading} = useChatCreation()
if(authLoading) return (
  <div className="w-full h-[100%] flex justify-center items-center">
    fetching chats....
  </div>
)
  return (
    <main className="flex-1 flex flex-col h-screen bg-gray-50">
      
      {/* Chat Header */}
      {singleUserLoading ? (
        <div className="w-full h-[60px] bg-gray-200 "></div>
      ) : (
        <ChatHeader
          avatar={singleUserData?.user?.avatar as string}
          isOnline={singleUserData?.user?.isOnline}
          username={singleUserData?.user?.username as string}
        />
      )}

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatLoading && (
          <div className="w-full h-full flex justify-center items-center">
            <LoadingDots />
          </div>
        )}
        {[...(chatData?.chat?.messages || []), ...messages].map((msg) => (
          <div key={msg?.id}>
            <MessageContainer
              id={msg?.id}
              createdAt={msg?.createdAt}
              senderId={msg?.senderId}
              userId={Number(user?.id)}
              content={msg?.content}
            />
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 px-4 py-4">
        <div className="flex items-end space-x-3">
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
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${input.trim()
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </main>
  );
}
