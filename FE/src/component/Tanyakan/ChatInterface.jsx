import React, { useEffect, useRef } from "react";
// 1. Import Icon dari React Icons
import { MdPerson, MdSmartToy, MdSend } from "react-icons/md";

const ChatInterface = ({ chatMessages, chatMessage, setChatMessage, handleSendChat, isChatLoading, userRole }) => {
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  return (
    <>
      <div className="mt-5 text-left flex flex-col card">
        <h3 className="heading-2 mb-4">
          Diskusi Lanjutan ({userRole === "Shipping" ? "Shipping Agent" : "Mining Agent"})
        </h3>
        
        {/* Container Chat dengan Scroll */}
        <div className="flex-1 space-y-4 mb-4 w-full h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          
          {chatMessages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 text-sm italic gap-2 opacity-50">
              <MdSmartToy size={40} />
              <p>Belum ada diskusi. Ketik pesan di bawah.</p>
            </div>
          )}

          {chatMessages.map((msg) =>
            msg.sender === "user" ? (
              // --- BUBBLE CHAT USER ---
              <div key={msg.id} className="flex justify-end w-full ">
                <div className="space-y-1 w-full flex flex-col items-end">
                  {/* Label User dengan Icon */}
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-right note">Saya</span>
                    <div className="p-1 bg-purple-500/20 rounded-full">
                      <MdPerson className="text-purple-400" />
                    </div>
                  </div>
                  
                  <div className="bg-purple-600 px-4 py-3 rounded-xl rounded-tr-none max-w-[85%] md:max-w-xs body-text !text-sm break-words shadow-lg">
                    {msg.text}
                  </div>
                </div>
              </div>
            ) : (
              // --- BUBBLE CHAT AGENT ---
              <div key={msg.id} className="flex justify-start w-full">
                <div className="w-full">
                  {/* Label Agent dengan Icon */}
                  <div className="flex items-center gap-2 mb-1">
                    <div className="p-1 bg-gray-700 rounded-full">
                      <MdSmartToy className="text-gray-400" />
                    </div>
                    <span className="text-left note !text-gray-400">Agent</span>
                  </div>

                  <div className={`px-4 py-3 rounded-xl rounded-tl-none max-w-[85%] md:max-w-xs body-text !text-sm break-words shadow-lg border border-white/5 ${msg.isLoading ? "bg-gray-800 italic animate-pulse text-gray-400" : "bg-[#1e1e1e]"}`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            )
          )}
          <div ref={chatEndRef}></div>
        </div>
      </div>

      {/* INPUT AREA */}
      <div className="sticky bottom-0 w-full z-10 p-2 md:p-4">
        <div className="max-w-4xl mx-auto flex items-center space-x-2 p-2 md:p-3 rounded-xl bg-[#0f0f0f] border border-gray-700 shadow-xl">
          <input
            type="text"
            placeholder={userRole === "Shipping" ? "Contoh: 'tambah kapasitas transport'" : "Contoh: 'tambah 2 truk lagi'"}
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendChat(chatMessage)}
            className="flex-1 p-3 !border-none bg-transparent !py-3 md:!py-4 !px-4 focus:outline-none text-white placeholder-gray-500 body-text text-sm md:text-base"
            disabled={isChatLoading}
          />
          
          {/* Tombol Kirim dengan Icon */}
          <button
            onClick={() => handleSendChat(chatMessage)}
            className="bg-primary hover:bg-font text-white font-btn text-[length:var(--size-btn)] 
            rounded-[16px] 
            transition-all duration-200 
            hover:scale-105 active:scale-95
            hover:cursor-pointer 
            max-w-fit py-3 px-5 disabled:bg-gray-600 disabled:scale-100 flex items-center gap-2"
            disabled={isChatLoading}
          >
            {isChatLoading ? (
              "..."
            ) : (
              <>
                <span className="hidden sm:inline">Kirim</span>
                <MdSend size={18} />
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default ChatInterface;