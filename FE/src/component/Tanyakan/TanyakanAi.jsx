import React, { useState, useRef, useEffect } from "react";
import StatusBar from "./StepBar";
import HasilRekomendasi from "./HasilRekomendasi";

const TanyakanAi = () => {
  const [isRecommendationOpen, setIsRecommendationOpen] = useState(true);
  const recommendationRef = useRef(null);

  // Chat states
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const chatEndRef = useRef(null);

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message
  const handleSend = () => {
    if (!message.trim()) return;

    const userMsg = {
      sender: "user",
      text: message,
      id: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setMessage("");

    setTimeout(() => {
      const botMsg = {
        sender: "bot",
        text: "Ini jawaban bot simulasi. Kamu ngetik: " + userMsg.text,
        id: Date.now() + 1,
      };

      setMessages((prev) => [...prev, botMsg]);
    }, 500);
  };

  return (
    <div className="min-h-[150vh] text-white p-4">
      <div className="max-w-4xl mx-auto">
        <StatusBar />

        <div ref={recommendationRef} className="mt-10 mb-10">
          <HasilRekomendasi
            isOpen={isRecommendationOpen}
            setIsOpen={setIsRecommendationOpen}
          />
        </div>

        {/* Chat area */}
        <div className="mt-5 mb-20  text-left">
          {messages.map((msg) =>
            msg.sender === "user" ? (
              <div key={msg.id} className="flex justify-end w-full ">
                <div className="space-y-1">
                  <p className="text-right"> Saya</p>
                  <div className="bg-purple-600 px-4 py-3 rounded-xl max-w-xs text-s ">
                    {msg.text}
                  </div>
                </div>
              </div>
            ) : (
              <div key={msg.id} className="flex justify-start w-full">
                <div>
                  <p className="text-left"> Bot</p>{" "}
                  <div className="bg-gray-700 px-4 py-3 rounded-xl max-w-xs text-sm">
                    {msg.text}
                  </div>
                </div>
              </div>
            )
          )}

          <div ref={chatEndRef}></div>
        </div>
      </div>

      {/* Input sticky */}
      <div className="sticky bottom-5 w-full z-50">
        <div className="max-w-4xl mx-auto flex items-center space-x-2  p-3 rounded-xl">
          <input
            type="text"
            placeholder="Ketik disini..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={handleSend}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold"
          >
            Kirim
          </button>
        </div>
      </div>
    </div>
  );
};

export default TanyakanAi;
