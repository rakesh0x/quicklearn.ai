"use client";

import { useState } from "react";
import { PanelLeftClose, PanelLeft, Calendar, CalendarDays,  } from "lucide-react";
import Link from "next/link";

export const Sidebar = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
  
    const menuItems = [
      { name: "Recent", icon: <CalendarDays className="w-6 h-6" />, path: "/PrevChat" },
      { name: "Last 7 Days", icon: <Calendar className="w-6 h-6" />, path: "/Yesterday" },
    ];              
  
    const toggleSidebar = () => {
      setIsOpen(!isOpen);
    };
  
    return (
      <div className="h-screen flex">
        <div
          className={`${
            isOpen ? "w-60" : "w-20"
          } h-screen fixed left-0 top-0 bg-gradient-to-b from-gray-900 to-gray-700 text-white 
            shadow-lg transition-all duration-300 ease-in-out z-20`}
        >
          <div className="flex justify-between items-center p-5 border-b border-gray-600">
            <h1
              className={`text-xl font-bold text-white transition-opacity duration-300
              ${isOpen ? "opacity-100" : "opacity-0 w-0 "}`}
            >
              Queries
            </h1>
            <button
              onClick={toggleSidebar}
              className="text-white p-2 rounded-lg hover:bg-gray-600 transition-colors duration-200"
              aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
            >
              {isOpen ? <PanelLeft className="w-6 h-6" /> : <PanelLeftClose className="w-6 h-6" />}
            </button>
          </div>
  
          {/* Sidebar Menu */}
          <nav className="mt-4 px-2">
            {menuItems.map((item, index) => (
              <Link
                href={item.path}
                key={index}
                className={`flex items-center gap-4 p-3 my-2 rounded-lg transition-all duration-200
                  hover:bg-gray-600/50 group relative
                  ${isOpen ? "justify-start" : "justify-center"}`}
              >
                <div className="min-w-[24px] flex items-center justify-center">
                  {item.icon}
                </div>
                <span 
                  className={`whitespace-nowrap transition-all duration-300
                  ${isOpen ? "opacity-100" : "opacity-0 w-0"}`}
                >
                  {item.name}
                </span>

                {!isOpen && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-sm rounded-md 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap
                    pointer-events-none z-50">
                    {item.name}
                  </div>
                )}
              </Link>
            ))}
          </nav>
        </div>
  
        <main 
          className={`flex-1 transition-all duration-300 ease-in-out
          ${isOpen ? "flex" : "ml-20"} p-6 w-full`}
        >
          {children}
        </main>
      </div>
    );
};

export default Sidebar;