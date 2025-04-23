"use client";

import { IntegratedGeminiChat } from "@/components/main";

export default function Page() {
  return (
    <div className="flex min-h-screen overflow-hidden">
      
      <main className="flex-1 flex flex-col overflow-auto">
        <IntegratedGeminiChat />
      </main>
    </div>
  );
}