"use client";

import { useState } from "react";
import { SendHorizontal, Loader2 } from "lucide-react";
import axios from "axios";
import { getTeachingPrompt, TeachingStyle } from "@/GeminiResponse/SystemPrompt";

interface GeminiResponse {
    candidates?: { content: { parts: { text: string }[] } }[];
    error?: string;
}

export const IntegratedGeminiChat = () => {
    const [inputData, setInputData] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState("");
    const [teachingStyle, setTeachingStyle] = useState<TeachingStyle>("standard"); 

    const API_KEY = `AIzaSyDKC7W_w8lEdbFN3MlXFj0wLBYU-Jcjgjg`;
    const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;

    const handleGeminiRequest = async (userInput: string): Promise<string> => {
        try {
            const systemPrompt = getTeachingPrompt(teachingStyle);

            const response = await axios.post<GeminiResponse>(GEMINI_API_URL, {
                contents: [
                    { role: "user", parts: [{ text: `${systemPrompt}\n\n${userInput}` }] }
                ]
            }, {
                headers: { 'Content-Type': 'application/json' }
            });

            console.log("Gemini API response:", response.data);
            return response.data.candidates?.[0]?.content?.parts?.[0]?.text ?? "No response received";
        } catch (error) {
            console.error("Error fetching Gemini response:", error.response?.data || error.message);
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
            <div className="text-3xl md:text-5xl font-bold text-center mt-24 px-4 animate-fade-in">
                <span className="bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
                    How can I help you?
                </span>
            </div>

            <div className="flex-grow flex items-center justify-center px-4 pb-8 md:pb-16 -mt-20">
                <form onSubmit={handleSubmit} className="w-full max-w-[800px] mx-auto relative">
                    <select 
                        className="mb-4 p-2 bg-gray-800 text-white rounded-md"
                        value={teachingStyle}
                        onChange={(e) => setTeachingStyle(e.target.value as TeachingStyle)}
                    >
                        <option value="standard">Standard</option>
                        <option value="short">Short</option>
                        <option value="interactive">Interactive</option>
                        <option value="advanced">Advanced</option>
                        <option value="storytelling">Storytelling</option>
                    </select>

                    <div className="relative rounded-lg">
                        <div className="flex">
                            <input
                                type="text"
                                className="flex-1 h-12 md:h-[70px] px-6 py-2 bg-black text-white rounded-l-lg outline-none"
                                placeholder="Type your query here..."
                                onChange={(e) => setInputData(e.target.value)}
                                value={inputData}
                                disabled={isLoading}
                            />
                            <button 
                                type="submit" 
                                disabled={isLoading || !inputData.trim()} 
                                className="px-4 bg-purple-500 text-white rounded-r-lg disabled:bg-purple-500/50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? <Loader2 size={20} className="animate-spin" /> : <SendHorizontal size={20} />}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            <div className="w-full max-w-[800px] mx-auto text-white px-6 pb-12">
                {isLoading ? (
                    <p className="text-center text-gray-400">Loading...</p>
                ) : response && (
                    <div className="p-4 bg-gray-800 rounded-lg shadow-md animate-fade-in">
                        <h2 className="text-lg font-semibold text-purple-400 mb-2">AI Response:</h2>
                        <div className="text-white">
                            {response}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
