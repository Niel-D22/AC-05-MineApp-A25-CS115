import React, { useEffect, useRef } from "react";

const ChatInterface = ({ chatMessages, chatMessage, setChatMessage, handleSendChat, isChatLoading, userRole }) => {
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  return (
    <>
      <div className="mt-5 text-left flex flex-col min-h-[300px] max-h-[500px] overflow-y-auto border border-gray-700 p-4 rounded-xl bg-gray-900">
        <h3 className="text-xl font-semibold mb-3 text-purple-400">
          Diskusi Lanjutan ({userRole === "Shipping" ? "Shipping Agent" : "Mining Agent"})
        </h3>
        <div className="flex-1 space-y-4 mb-4">
          {chatMessages.map((msg) =>
            msg.sender === "user" ? (
              <div key={msg.id} className="flex justify-end w-full ">
                <div className="space-y-1">
                  <p className="text-right text-xs text-gray-400"> Saya</p>
                  <div className="bg-purple-600 px-4 py-3 rounded-xl max-w-xs text-sm">
                    {msg.text}
                  </div>
                </div>
              </div>
            ) : (
              <div key={msg.id} className="flex justify-start w-full">
                <div>
                  <p className="text-left text-xs text-gray-400"> Agent</p>
                  <div className={`px-4 py-3 rounded-xl max-w-xs text-sm ${msg.isLoading ? "bg-gray-600 italic animate-pulse" : "bg-gray-700"}`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            )
          )}
          <div ref={chatEndRef}></div>
        </div>
      </div>

      <div className="sticky bottom-0 w-full z-10 p-4">
        <div className="max-w-4xl mx-auto flex items-center space-x-2 p-3 rounded-xl">
          <input
            type="text"
            placeholder={userRole === "Shipping" ? "Contoh: 'tambah kapasitas transport'" : "Contoh: 'tambah 2 truk lagi'"}
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendChat(chatMessage)}
            className="flex-1 p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={isChatLoading}
          />
          <button
            onClick={() => handleSendChat(chatMessage)}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold disabled:bg-gray-500"
            disabled={isChatLoading}
          >
            {isChatLoading ? "..." : "Kirim"}
          </button>
        </div>
      </div>
    </>
  );
};

export default ChatInterface;