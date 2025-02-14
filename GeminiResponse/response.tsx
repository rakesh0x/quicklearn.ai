"use client"

import axios from "axios";
import { TeachingPromptComponent } from "./SystemPrompt";
import { useState } from "react";


const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const GEMINI_API_URL = process.env.NEXT_PUBLIC_GEMINI_API_URL;

// Define types for API response and request
interface GeminiResponse {
    data: any;
}

interface GeminiRequest {
    contents: {
        role: string;
        parts: { text: string }[];
    }[];
}

export function GeminiResponse() {
    const [systemPrompt, setSystemPrompt] = useState<string>("")

    const handlePromptChange = (prompt: string) => {
        setSystemPrompt(prompt);
    };

    const handleGeminiRequest = async (inputData: string): Promise<GeminiResponse> => {
        try {
            const response = await axios.post<GeminiResponse>(GEMINI_API_URL!, {
                contents: [
                    { role: "system", parts: [{ text: systemPrompt }] },
                    { role: "user", parts: [{ text: inputData }] }
                ]
            } as GeminiRequest, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                }
            });

            console.log("Gemini Response:", response.data);
            return response.data;

        } catch (error) {
            console.error("Error fetching Gemini response:", error);
            throw error;
        }
    };

    return (
        <div>
            <TeachingPromptComponent onChange={handlePromptChange} onSubmit={handleGeminiRequest} />
            {/* Add any other UI elements you need */}
        </div>
    );
}