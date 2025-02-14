"use client";

import { useState } from "react";
import { PanelLeftClose, PanelLeft, Calendar, CalendarDays } from "lucide-react";
import Link from "next/link";

interface SidebarProps {
  children: React.ReactNode;
}

export const Sidebar = ({ children }: SidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    console.log("Toggling sidebar"); // Debugging
    setIsOpen(!isOpen);
  };

  const menuItems = [
    { name: "Recent", icon: <CalendarDays className="w-5 h-5" />, path: "/PrevChat" },
    { name: "Last 7 Days", icon: <Calendar className="w-5 h-5" />, path: "/Yesterday" },
  ];

  return (
    <div className="h-screen w-screen overflow-hidden fixed inset-0">
      {/* Sidebar */}
      <div
        className={`${
          isOpen ? "w-64 translate-x-0" : "w-20 translate-x-0"
        } h-full fixed left-0 top-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 
        text-white shadow-xl transition-all duration-300 ease-in-out z-20 border-r border-white/10`}
      >
        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <h1
            className={`text-lg font-semibold text-white transition-all duration-300 
            ${isOpen ? "opacity-100" : "opacity-0 w-0"}`}
          >
            <span className="bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent">
              Queries
            </span>
          </h1>
          <button
            onClick={toggleSidebar}
            className="text-white/80 p-2 rounded-lg hover:bg-white/10 transition-all duration-200 
            hover:text-white hover:shadow-lg hover:shadow-purple-500/20 pointer-events-auto z-50"
            aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
          >
            {isOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeft className="w-5 h-5" />}
          </button>
        </div>

        {/* Sidebar Menu */}
        <nav className="mt-6 px-3">
          {menuItems.map((item, index) => (
            <Link
              href={item.path}
              key={index}
              onClick={(e) => e.stopPropagation()} // Prevent event propagation
              className={`flex items-center gap-4 p-3 my-2 rounded-lg transition-all duration-200
                ${isOpen ? "justify-start" : "justify-center"}
                hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-transparent
                hover:border-l-2 hover:border-purple-400 hover:pl-[10px]
                group relative pointer-events-auto`} // Ensure clickable
            >
              <div className="min-w-[24px] flex items-center justify-center 
                text-purple-300 group-hover:text-white transition-colors duration-200">
                {item.icon}
              </div>
              <span
                className={`whitespace-nowrap transition-all duration-300 text-sm
                text-gray-300 group-hover:text-white
                ${isOpen ? "opacity-100" : "opacity-0 w-0"}`}
              >
                {item.name}
              </span>

              {!isOpen && (
                <div
                  className="absolute left-full ml-4 px-3 py-2 bg-gray-800 text-xs rounded-md
                  opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap
                  pointer-events-none z-50 shadow-xl shadow-black/50
                  border border-white/10 backdrop-blur-sm bg-opacity-90"
                >
                  {item.name}
                </div>
              )}
            </Link>
          ))}
        </nav>

        {/* Bottom Gradient Border */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t 
          from-purple-900/50 to-transparent pointer-events-none" />
      </div>

      {/* Main Content */}
      <main
        className={`h-screen overflow-y-auto transition-all duration-300 ease-in-out
          ${isOpen ? "ml-64" : "ml-20"}`}
      >
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};