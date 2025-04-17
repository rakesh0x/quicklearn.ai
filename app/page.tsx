"use client";

import { IntegratedGeminiChat } from "@/components/main";
import { Sidebar } from "@/components/sidebar";

export default function Page() {
  return (
    <div className="flex min-h-screen overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 flex flex-col overflow-auto">
        <IntegratedGeminiChat />
      </main>
    </div>
  );
}