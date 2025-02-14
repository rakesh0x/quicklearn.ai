import { InputBar } from "@/components/contentPage"
import { Sidebar } from "../components/sidebar"

export default function Page() {
  return (
    <div className="flex h-screen">
      <Sidebar />

      <main className="flex-1 flex flex-col">
        <InputBar />
        {/* Add other page content here */}
      </main>
    </div>
  );
}