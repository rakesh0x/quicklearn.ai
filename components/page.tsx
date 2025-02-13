"use client";
import { Sidebar } from "./sidebar";
import { ContentBar } from "./contentbar";

export const LandingPage = () => {
  return (
    <>
      

      <div className="flex mt-20">
        <Sidebar/>
        <ContentBar />
      </div>

      
    </>
  );
};


