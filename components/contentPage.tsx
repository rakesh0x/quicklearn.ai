
"use client"

import { useState } from "react";
import { SendHorizontal } from "lucide-react";

export const InputBar = () => {

    const [isInputData, setInputData] = useState(" ");


    const HandleInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputData(e.target.value);
      };


    return (
        <div className="contentPage">
            <div className=" w-full fixed top-0 h-16 font-semibold text-2xl text-center mt-6">
                QuickLearn.ai
            </div>

            <h1 className="text-5xl font-bold relative text-center mt-10">
                How can I help you ?
            </h1>
            
            <div className="relative w-full flex justify-center items-center h-[calc(100vh-16rem)]"> {/* Adjusted height to fit within viewport */}
      <div className="relative w-[800px]">
        <input
          type="text"
          className="w-full h-[70px] px-4 py-2 border border-purple-400 bg-black text-white rounded-md outline-none ring-2 ring-purple-400 pr-12"
          placeholder="Type Your Query Here"
          onChange={HandleInputValue}
          value={isInputData}
        />
        <button
          className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-purple-500 hover:bg-purple-700 text-white p-2 rounded-md"
        >
          <SendHorizontal size={24} />
        </button>
      </div>
    </div>






        </div>
    ) 
    


}
