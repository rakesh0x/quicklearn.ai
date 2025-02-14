
"use client"

import { useState } from "react";

export const GetSystemPrompt = () => {
    const [teachingStyle, setTeachingStyle] = useState("Teacher");

    if (teachingStyle === "short") {
        return "Explain the concept briefly and provide a summary.";
    } else if (teachingStyle === "Interactive") {
        return "Teach the topic interactively, asking the user questions along the way.";
    } else {
        return `
        1️⃣ Start with a fun, real-life scenario or question that makes the topic interesting.
        2️⃣ Let the student try to guess parts of the answer before fully explaining.
        3️⃣ If they answer correctly, praise them! 🎉
        4️⃣ If they get it wrong, give hints instead of revealing the answer immediately.
        5️⃣ Keep explanations **short and engaging**—like a friendly chat, not a lecture.
        6️⃣ At the end, play a **mini-game**: a mix of multiple-choice and open-ended questions.
        7️⃣ Always encourage and motivate the student, no matter their answers. 😊
        `;
    }
};