import React, { useEffect, useRef } from "react";

const ChatInterface = ({ chatMessages, chatMessage, setChatMessage, handleSendChat, isChatLoading, userRole }) => {
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  return (
    <>
      <div className="mt-5 text-left flex flex-col card">
        <h3 className="heading-2">
          Diskusi Lanjutan ({userRole === "Shipping" ? "Shipping Agent" : "Mining Agent"})
        </h3>
        <div className="flex-1 space-y-4 mb-4 w-full">
          {chatMessages.map((msg) =>
            msg.sender === "user" ? (
              <div key={msg.id} className="flex justify-end w-full ">
                <div className="space-y-1">
                  <p className="text-right note"> Saya</p>
                  <div className="bg-purple-600 px-4 py-3 rounded-xl max-w-xs body-text !text-sm">
                    {msg.text}
                  </div>
                </div>
              </div>
            ) : (
              <div key={msg.id} className="flex justify-start w-full">
                <div>
                  <p className="text-left note !text-gray-400"> Agent</p>
                  <div className={`px-4 py-3 rounded-xl max-w-xs body-text !text-sm ${msg.isLoading ? "bg-gray-600 italic animate-pulse" : "bg-gray-700"}`}>
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
            className="flex-1 p-3 !border-none card !py-4 !px-4 focus:outline-none focus:ring-2 focus:ring-purple-500 body-text"
            disabled={isChatLoading}
          />
          <button
            onClick={() => handleSendChat(chatMessage)}
            className="bg-primary text-white font-btn text-[length:var(--size-btn)] 
            rounded-[20px] 
            transition-all duration-200 
            hover:cursor-pointer 
            max-w-fit py-2 px-6 disabled:bg-gray-500"
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