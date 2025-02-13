import { LandingPage } from "@/components/page"
import Sidebar from "@/components/sidebar"
import { ContentBar } from "@/components/contentbar"

export default function finalPage() {
  return (
    <div>
      <LandingPage/> 
      <Sidebar/>
      <ContentBar />
    </div>
  )
}