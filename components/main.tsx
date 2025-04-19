"use client";

import { useState } from "react";
import { SendHorizontal } from "lucide-react";
import axios, { AxiosError } from "axios";
import { getTeachingPrompt, TeachingStyle } from "@/GeminiResponse/SystemPrompt";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

interface GeminiResponse {
  candidates?: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
  error?: string;
}

interface TeachingPrompt {
  teachingStyle: string;
}

export const IntegratedGeminiChat = () => {
  const [inputData, setInputData] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [teachingStyle, setTeachingStyle] = useState<TeachingStyle>(TeachingStyle.Short);
  const api_key = `AIzaSyDKC7W_w8lEdbFN3MlXFj0wLBYU-Jcjgjg`;
  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${api_key}`;

  const handleGeminiRequest = async (userInput: string): Promise<string> => {
    try {
      const systemPrompt = getTeachingPrompt(teachingStyle);

      if (!GEMINI_API_URL) {
        throw new Error("API URL is not defined");
      }

      const response = await axios.post<GeminiResponse>(
        GEMINI_API_URL,
        {
          contents: [
            {
              role: "user",
              parts: [{ text: `${systemPrompt}\n\n${userInput}` }],
            },
          ],
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("Gemini API response:", response.data);
      return (
        response.data.candidates?.[0]?.content?.parts?.[0]?.text ??
        "No response received"
      );
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(
        "Error fetching Gemini response:",
        JSON.stringify(
          axiosError.response?.data || axiosError.message,
          null,
          2
        )
      );
      return "Error processing request";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputData.trim()) return;

    setIsLoading(true);
    setResponse("");

    try {
      const reply = await handleGeminiRequest(inputData);
      setResponse(reply);
    } catch (error) {
      setResponse("Sorry, there was an error processing your request.");
    } finally {
      setIsLoading(false);
      setInputData("");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-black to-gray-900">
      {/* Website Title */}
      <div className="text-4xl md:text-2xl font-bold text-center mt-8 mb-4">
        <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
          QuickLearn.ai
        </span>
      </div>

      <div className="text-3xl md:text-5xl font-bold text-center mt-12 px-4 animate-fade-in">
        <span className="bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
          How can I help you?
        </span>
      </div>

      <div className="flex-grow flex items-center justify-center px-4 pb-8 md:pb-16 -mt-20">
        <form onSubmit={handleSubmit} className="w-full max-w-[800px] mx-auto">
          <div className="mb-6">
            <label
              htmlFor="teaching-style"
              className="block text-sm font-medium text-gray-400 mb-2"
            >
              Teaching Style
            </label>
            <select
              id="teaching-style"
              className="relative z-10 w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
              value={teachingStyle}
              onChange={(e) => {
                const Selected = e.target.value as keyof typeof TeachingStyle;
                setTeachingStyle(TeachingStyle[Selected]);
              }}
            >
              <option value={TeachingStyle.Standard}>Standard</option>
              <option value={TeachingStyle.Short}>Short</option>
              <option value={TeachingStyle.Interactive}>Interactive</option>
              <option value={TeachingStyle.Advanced}>Advanced</option>
              <option value={TeachingStyle.Storytelling}>Storytelling</option>
            </select>
          </div>

          <div className="relative rounded-lg shadow-lg">
            <div className="flex items-center">
              <input
                type="text"
                className="flex-1 h-14 md:h-16 px-6 py-2 bg-gray-800 text-white rounded-l-lg outline-none border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 transition-all"
                placeholder="Type your query here..."
                onChange={(e) => setInputData(e.target.value)}
                value={inputData}
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !inputData.trim()}
                className="h-14 md:h-16 px-6 bg-purple-600 text-white rounded-r-lg hover:bg-purple-700 disabled:bg-purple-600/50 disabled:cursor-not-allowed transition-all"
              >
                <SendHorizontal size={24} />
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="w-full max-w-[800px] mx-auto text-white px-6 pb-12 flex-grow relative">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full bg-gray-700" />
            <Skeleton className="h-12 w-full bg-gray-700" />
            <Skeleton className="h-12 w-full bg-gray-700" />
          </div>
        ) : (
          response && (
            <div className="p-6 bg-gray-800 rounded-lg shadow-md animate-fade-in border border-gray-700 relative overflow-hidden">
              <h2 className="text-lg font-semibold text-purple-400 mb-4">
                AI Response:
              </h2>
              <div className="text-white loading-relaxed whitespace-pre-wrap">
                {response.split("\n").map((line: string, index: number) => (
                  <p key={index} className="mb-4">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};