"use client";

import { useState } from "react";
import { SendHorizontal, Loader2 } from "lucide-react";

export const InputBar = () => {
  const [inputData, setInputData] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputData(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputData.trim()) return;
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    setInputData("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-black to-gray-900">
      {/* Logo */}
      <div className="w-full fixed top-0 h-16 font-semibold text-xl md:text-2xl text-center mt-6 px-4">
        <span className="bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent">
          QuickLearn.ai
        </span>
      </div>

      {/* Title with gradient - adjusted margin-top */}
      <h1 className="text-3xl md:text-5xl font-bold text-center mt-32 md:mt-40 px-4 animate-fade-in">
        <span className="bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
          How can I help you?
        </span>
      </h1>

      {/* Input Bar Container */}
      <div className="flex-grow flex items-center justify-center px-4 pb-8 md:pb-16 -mt-20">
        <form 
          onSubmit={handleSubmit}
          className="w-full max-w-[800px] mx-auto relative"
        >
          <div className="relative group">
            {/* Moving light effect container */}
            <div className="absolute -inset-1 rounded-lg bg-black">
              {/* Rotating gradient borders */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-0 group-hover:opacity-100 animate-border-shine" />
              <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-transparent via-purple-500 to-transparent opacity-0 group-hover:opacity-100 animate-border-shine-vertical" />
              
              {/* Moving light spot */}
              <div className="absolute w-32 h-32 bg-purple-500 rounded-full blur-[64px] animate-border-light opacity-0 group-hover:opacity-50" />
            </div>

            {/* Input field */}
            <div className="relative bg-black rounded-lg p-[1px]">
              <input
                type="text"
                className="w-full h-12 md:h-[70px] px-6 py-2 bg-black text-white rounded-lg 
                          outline-none text-sm md:text-base placeholder-gray-400
                          transition-all duration-300"
                placeholder="Type your query here..."
                onChange={handleInputValue}
                value={inputData}
                disabled={isLoading}
              />
              
              <button
                type="submit"
                disabled={isLoading || !inputData.trim()}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 
                          p-2 rounded-md transition-all duration-300
                          ${isLoading ? 'bg-purple-700' : 
                            inputData.trim() ? 'bg-purple-500 hover:bg-purple-600' : 
                            'bg-purple-500/50 cursor-not-allowed'}
                          text-white`}
              >
                {isLoading ? (
                  <Loader2 size={20} className="md:w-6 md:h-6 animate-spin" />
                ) : (
                  <SendHorizontal size={20} className="md:w-6 md:h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Suggestion Pills */}
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            {["How to learn React?", "Explain APIs", "What is TypeScript?"].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setInputData(suggestion)}
                className="px-4 py-2 text-sm bg-purple-500/10 hover:bg-purple-500/20 
                         text-purple-300 rounded-full transition-all duration-300
                         border border-purple-500/20 hover:border-purple-500/40"
                type="button"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </form>
      </div>
    </div>
  );
};

// Add these animations to your global CSS
const styles = `
@keyframes fade-in {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes border-shine {
  0%, 100% { opacity: 0; transform: translateX(-100%); }
  50% { opacity: 1; transform: translateX(100%); }
}

@keyframes border-shine-vertical {
  0%, 100% { opacity: 0; transform: translateY(-100%); }
  50% { opacity: 1; transform: translateY(100%); }
}

@keyframes border-light {
  0% { transform: rotate(0deg) translateX(150px) rotate(0deg); }
  100% { transform: rotate(360deg) translateX(150px) rotate(-360deg); }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out;
}

.animate-border-shine {
  animation: border-shine 3s linear infinite;
}

.animate-border-shine-vertical {
  animation: border-shine-vertical 3s linear infinite;
}

.animate-border-light {
  animation: border-light 3s linear infinite;
}
`;