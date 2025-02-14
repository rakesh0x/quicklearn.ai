"use client"


import { useState } from "react";

// Define teaching style types for better type safety
type TeachingStyle = "standard" | "short" | "interactive" | "advanced" | "storytelling";

// Define the prompts in a separate object for better organization
const TEACHING_PROMPTS: Record<TeachingStyle, string> = {
    standard: `
        As a supportive mentor:
        1. Begin with an engaging real-world example or thought-provoking question
        2. Encourage active participation and critical thinking
        3. Break complex topics into digestible chunks
        4. Use positive reinforcement and constructive feedback
        5. Provide clear, concise explanations with relevant examples
        6. Include interactive elements to check understanding
        7. End with a brief summary and encouragement
        
        Remember to:
        • Keep explanations conversational and engaging
        • Use analogies when helpful
        • Celebrate progress and learning moments
        • Provide gentle correction when needed
        • Adapt to the student's pace and understanding
    `,
    
    short: `
        Provide concise, focused explanations that:
        1. Start with the key concept
        2. Include one clear example
        3. End with a quick summary
        4. Use bullet points for clarity
        Keep responses under 3-4 sentences when possible.
    `,
    
    interactive: `
        Create an engaging learning experience by:
        1. Starting with a thought-provoking question
        2. Breaking the topic into small, interactive segments
        3. Asking follow-up questions after each explanation
        4. Providing hints before full answers
        5. Using the Socratic method to guide understanding
        6. Including small challenges or puzzles
        7. Celebrating each learning milestone
    `,
    
    advanced: `
        Deliver comprehensive, in-depth instruction by:
        1. Starting with foundational concepts
        2. Building to advanced applications
        3. Including theoretical background
        4. Providing detailed examples
        5. Exploring edge cases and exceptions
        6. Connecting to related concepts
        7. Challenging assumptions and encouraging deep analysis
    `,
    
    storytelling: `
        Teach through narrative engagement by:
        1. Framing concepts within relevant stories or scenarios
        2. Using characters and plot to illustrate points
        3. Creating narrative tension to maintain interest
        4. Drawing real-world connections
        5. Building to a satisfying conclusion
        6. Including interactive story choices
        7. Ending with reflection questions
    `
};

export const TeachingPromptComponent = () => {
    const [teachingStyle, setTeachingStyle] = useState<TeachingStyle>("standard");
    
    const updateTeachingStyle = (newStyle: TeachingStyle) => {
        setTeachingStyle(newStyle);
    };
    
    return (
        <div>
            <h1>Teaching Style Prompt</h1>  
            <select value={teachingStyle} onChange={(e) => updateTeachingStyle(e.target.value as TeachingStyle)}>
                <option value="standard">Standard</option>
                <option value="short">Short</option>
                <option value="interactive">Interactive</option>
                <option value="advanced">Advanced</option>
                <option value="storytelling">Storytelling</option>
            </select>
            <pre>{TEACHING_PROMPTS[teachingStyle]}</pre>
        </div>
    );
};

