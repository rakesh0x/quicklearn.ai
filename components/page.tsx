"use client"

export const LandingPage = () => {
  return (
    <div className="relative h-screen flex items-center justify-center bg-black text-white">
      <div className="w-full top-0 h-16 fixed z-20 font-semibold ml-20 mt-6 text-2xl ">
        QuickLearn.ai
      </div>
      <svg
        className="absolute inset-0 w-full h-full opacity-20"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <defs>
          <pattern
            id="grid"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      <h1 className="text-5xl font-bold relative">Backgrounds</h1>
    </div>
  );
}