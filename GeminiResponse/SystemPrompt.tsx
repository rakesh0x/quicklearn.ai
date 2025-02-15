// teachingPrompt.ts (or keep in TeachingPromptComponent.tsx)
export type TeachingStyle = "standard" | "short" | "interactive" | "advanced" | "storytelling";

export const TEACHING_PROMPTS: Record<TeachingStyle, string> = {
    standard: `You are a supportive mentor...`,  // (same as before)
    short: `Provide concise explanations...`,
    interactive: `Create an engaging learning experience...`,
    advanced: `Deliver comprehensive, in-depth instruction...`,
    storytelling: `Teach through narrative engagement...`
};

// Function to get the system prompt based on selected style
export const getTeachingPrompt = (style: TeachingStyle): string => TEACHING_PROMPTS[style];
