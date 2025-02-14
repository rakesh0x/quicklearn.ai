"use client"

import axios from "axios";
import { TeachingPromptComponent } from "./SystemPrompt";
import { useState } from "react";

const API_KEY = process.env.API_KEY;
const GEMINI_API_URL = process.env.GEMINI_API_URL;



interface  

interface GeminiRequest {
    contents: {
        role: string;
        parts: { text: string }[];
    }[];
}

export function GeminiResponse() {
    const [systemPrompt, setSystemPrompt] = useState<string>("");

    const handlePromptChange = (prompt: string) => {
        setSystemPrompt(prompt);
    };

    const handleGeminiRequest = async (inputData: string): Promise<GeminiResponse> => {
        try {
            const response = await axios({
                url: GEMINI_API_URL,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                },
                data: {
                    contents: [
                        { role: "system", parts: [{ text: systemPrompt }] },
                        { role: "user", parts: [{ text: inputData }] }
                    ]
                } as GeminiRequest
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
            <TeachingPromptComponent onPromptChange={handleGeminiRequest} />
            {/* Add any other UI elements you need */}
        </div>
    );
}