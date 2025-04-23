"use client";

import { Children, useState } from "react";
import { SendHorizontal, Loader2, BookOpen, Youtube, Sparkles } from "lucide-react";
import axios, { AxiosError } from "axios";
import { getTeachingPrompt, TeachingStyle } from "@/components/GeminiResponse/SystemPrompt";
import { Skeleton } from "@/components/ui/skeleton";
import { GeminiResponse } from "./interfaces/types";
import { YoutubeAnalyticsResponse } from "./interfaces/types";
import { YoutubeVideoResponse } from "./interfaces/types";
import { YoutubeVideoItem } from "./interfaces/types";
import { YoutubeAnalytics } from "./interfaces/types";

export const IntegratedGeminiChat = () => {
  const [inputData, setInputData] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [videos, setVideos] = useState<YoutubeVideoItem[]>([]);
  const [teachingStyle, setTeachingStyle] = useState<TeachingStyle>(TeachingStyle.Short);
  const [videoStats, setVideoStats] = useState<Record<string, YoutubeAnalytics['statistics']>>({});
  const [isFetchingVideos, setIsFetchingVideos] = useState(false);
  const [animateResponse, setAnimateResponse] = useState(false);

  const api_key = process.env.NEXT_PUBLIC_API_KEY; 
  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${api_key}`;
  const youtube_api_key = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
  const Youtube_Base_url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&key=${youtube_api_key}`;
  const youtube_analytics_url = `https://www.googleapis.com/youtube/v3/videos?part=statistics&key=${youtube_api_key}`;

  const teachingStyleOptions = [
    { value: TeachingStyle.Standard, label: "Standard", description: "Balanced teaching approach" },
    { value: TeachingStyle.Short, label: "Concise", description: "Brief, to-the-point explanations" },
    { value: TeachingStyle.Interactive, label: "Interactive", description: "Engaging, question-based teaching" },
    { value: TeachingStyle.Advanced, label: "Advanced", description: "Deep, technical explanations" },
    { value: TeachingStyle.Storytelling, label: "Storytelling", description: "Narrative-based learning" },
    { value: TeachingStyle.Deepanalysis, label: "Deep Analysis", description: "Comprehensive breakdowns" }   
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputData.trim()) return;

    setIsLoading(true);
    setIsFetchingVideos(true);
    setResponse("");
    setVideos([]);
    setVideoStats({});
    setAnimateResponse(false);

    try {
      const geminiResponse = await axios.post(GEMINI_API_URL, {
        contents: [{
          parts: [{
            text: getTeachingPrompt(inputData, teachingStyle)
          }]
        }]
      });

      const geminiData = geminiResponse.data as GeminiResponse;
      if (geminiData.candidates?.[0]?.content?.parts?.[0]?.text) {
        setResponse(geminiData.candidates[0].content.parts[0].text);
        setAnimateResponse(true);
      }

      const youtubeResponse = await axios.get(`${Youtube_Base_url}&q=${encodeURIComponent(inputData)}&maxResults=4`);
      const youtubeData = youtubeResponse.data as YoutubeVideoResponse;
      setVideos(youtubeData.items);

      const videoIds = youtubeData.items.map(video => video.id.videoId).join(',');
      const statsResponse = await axios.get(`${youtube_analytics_url}&id=${videoIds}`);
      const statsData = statsResponse.data as YoutubeAnalyticsResponse;
      
      const statsMap: Record<string, YoutubeAnalytics['statistics']> = {};
      statsData.items.forEach(item => {
        statsMap[item.id] = item.statistics;
      });
      setVideoStats(statsMap);
    } catch (error) {
      if (error instanceof AxiosError) {
        setResponse(`Error: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
      setIsFetchingVideos(false);
    }
  };

  return (

  <div className="min-h-screen flex flex-col bg-black relative">
   <div className="absolute inset-0 [background-image:linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:40px_40px]"></div>

      <nav >
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-6 w-6 text-purple-400" />
            <h1 className="text-2xl font-bold">
              <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent">
                QuickLearn.ai
              </span>
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <a href="#" className="text-gray-400 hover:text-white text-sm transition">Features</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition">About</a>
            <button className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-3 py-1.5 rounded-md transition">Sign In</button>
          </div>
        </div>
      </nav>

      <main className="flex-grow flex flex-col items-center px-4 pb-12 pt-8">
        <div className="w-full max-w-4xl mx-auto">
          <section className="text-center mb-10 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Learn Anything with AI
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Get instant explanations powered by AI and curated video recommendations
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <div className="flex items-center px-3 py-1.5 bg-indigo-900/40 rounded-full border border-indigo-800/30">
                <div className="w-2 h-2 rounded-full bg-indigo-400 mr-2"></div>
                <span className="text-indigo-300 text-xs">Deep Learning</span>
              </div>
              <div className="flex items-center px-3 py-1.5 bg-purple-900/40 rounded-full border border-purple-800/30">
                <div className="w-2 h-2 rounded-full bg-purple-400 mr-2"></div>
                <span className="text-purple-300 text-xs">History</span>
              </div>
              <div className="flex items-center px-3 py-1.5 bg-pink-900/40 rounded-full border border-pink-800/30">
                <div className="w-2 h-2 rounded-full bg-pink-400 mr-2"></div>
                <span className="text-pink-300 text-xs">Mathematics</span>
              </div>
              <div className="flex items-center px-3 py-1.5 bg-blue-900/40 rounded-full border border-blue-800/30">
                <div className="w-2 h-2 rounded-full bg-blue-400 mr-2"></div>
                <span className="text-blue-300 text-xs">Physics</span>
              </div>
              <div className="flex items-center px-3 py-1.5 bg-green-900/40 rounded-full border border-green-800/30">
                <div className="w-2 h-2 rounded-full bg-green-400 mr-2"></div>
                <span className="text-green-300 text-xs">Biology</span>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl shadow-xl border border-purple-900/30 p-6">
              <form onSubmit={handleSubmit} className="w-full">
                <div className="mb-5">
                  <label
                    htmlFor="teaching-style"
                    className="block text-sm font-medium text-gray-300 mb-2 flex items-center"
                  >
                    <BookOpen className="h-4 w-4 mr-2 text-purple-400" />
                    Choose Your Learning Style
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {teachingStyleOptions.map((option) => (
                      <div 
                        key={option.value}
                        className={`cursor-pointer rounded-lg border p-3 transition-all ${
                          teachingStyle === option.value 
                            ? 'bg-purple-900/50 border-purple-500' 
                            : 'bg-gray-800/30 border-gray-700 hover:border-gray-600'
                        }`}
                        onClick={() => setTeachingStyle(option.value)}
                      >
                        <div className="font-medium text-sm text-white mb-1">{option.label}</div>
                        <div className="text-xs text-gray-400">{option.description}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="relative rounded-xl shadow-lg overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-pink-500/20"></div>
                  <div className="relative flex items-center bg-slate-800/90 rounded-lg overflow-hidden">
                    <input
                      type="text"
                      className="flex-1 h-16 px-6 py-2 bg-transparent text-white text-lg placeholder-gray-500 outline-none border-0"
                      placeholder="What would you like to learn about?"
                      onChange={(e) => setInputData(e.target.value)}
                      value={inputData}
                      disabled={isLoading}
                    />
                    <button
                      type="submit"
                      disabled={isLoading || !inputData.trim()}
                      className="h-16 px-8 bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 font-medium"
                    >
                      {isLoading ? (
                        <><Loader2 className="h-5 w-5 animate-spin" /> Processing</>
                      ) : (
                        <><SendHorizontal size={18} /> Ask</>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </section>

          <section className="w-full">
            {isLoading ? (
              <div className="space-y-5 bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/30 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <Loader2 className="h-5 w-5 text-purple-400 animate-spin" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-300">Generating response...</h3>
                    <p className="text-sm text-gray-400">Our AI is crafting the perfect explanation</p>
                  </div>
                </div>
                <Skeleton className="h-4 w-full bg-slate-700/50 rounded-full" />
                <Skeleton className="h-4 w-11/12 bg-slate-700/50 rounded-full" />
                <Skeleton className="h-4 w-10/12 bg-slate-700/50 rounded-full" />
                <Skeleton className="h-4 w-full bg-slate-700/50 rounded-full" />
                <Skeleton className="h-4 w-9/12 bg-slate-700/50 rounded-full" />
                
                <div className="pt-6 mt-8 border-t border-slate-700/50">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                      <Youtube className="h-5 w-5 text-red-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-red-300">Finding videos...</h3>
                      <p className="text-sm text-gray-400">Curating the best learning resources</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Skeleton className="h-40 w-full bg-slate-700/50 rounded-xl" />
                    <Skeleton className="h-40 w-full bg-slate-700/50 rounded-xl" />
                  </div>
                </div>
              </div>
            ) : (
              (response || videos.length > 0) && (
                <div className={`bg-slate-800/40 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/30 shadow-lg ${animateResponse ? 'animate-fade-in' : ''}`}>
                  {response && (
                    <>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                          <Sparkles className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-white">AI Explanation</h3>
                          <p className="text-sm text-gray-400">Tailored to your learning style</p>
                        </div>
                      </div>
                      <div className="text-gray-200 leading-relaxed space-y-4 font-light">
                        {response.split("\n\n").map((paragraph: string, index: number) => (
                          <p key={index}>{paragraph}</p>
                        ))}
                      </div>
                    </>
                  )}

                  {videos.length > 0 && (
                    <>
                      <div className="flex items-center gap-3 mt-10 mb-6 pt-6 border-t border-slate-700/50">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                          <Youtube className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-white">Video Resources</h3>
                          <p className="text-sm text-gray-400">Handpicked content to enhance your learning</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {videos.map((video) => (
                          <a
                            key={video.id.videoId}
                            href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group block"
                          >
                            <div className="bg-slate-800 rounded-xl overflow-hidden transition-all border border-slate-700 hover:border-red-500/50 hover:shadow-lg hover:shadow-red-500/10">
                              <div className="relative pt-[56.25%] overflow-hidden">
                                <img
                                  src={video.snippet.thumbnails.default.url.replace(
                                    "default",
                                    "mqdefault"
                                  )}
                                  alt={video.snippet.title}
                                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-70 group-hover:opacity-80 transition-opacity" />
                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                  <h3 className="text-sm md:text-base font-medium text-white line-clamp-2 mb-2 group-hover:text-red-300 transition-colors">
                                    {video.snippet.title}
                                  </h3>
                                  {videoStats[video.id.videoId] && (
                                    <div className="flex items-center gap-4 text-xs text-gray-300">
                                      <span className="flex items-center gap-1">
                                        <EyeIcon className="w-3 h-3" />
                                        {abbreviateNumber(
                                          parseInt(videoStats[video.id.videoId].viewCount)
                                        )}
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <ThumbsUpIcon className="w-3 h-3" />
                                        {abbreviateNumber(
                                          parseInt(videoStats[video.id.videoId].likeCount)
                                        )}
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <MessageSquareIcon className="w-3 h-3" />
                                        {abbreviateNumber(
                                          parseInt(videoStats[video.id.videoId].commentCount)
                                        )}
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <div className="absolute top-3 right-3">
                                  <div className="flex items-center rounded-full bg-red-600/90 text-white text-xs px-2.5 py-1">
                                    <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="currentColor">
                                      <path d="M8 5v14l11-7z" />
                                    </svg>
                                    Watch
                                  </div>
                                </div>
                              </div>
                            </div>
                          </a>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )
            )}
          </section>
        </div>
      </main>


      <footer className="bg-slate-900/80 backdrop-blur-md border-t border-slate-800/50 py-6">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Sparkles className="h-5 w-5 text-purple-400 mr-2" />
              <span className="text-gray-400 text-sm">© 2025 QuickLearn.ai</span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-purple-400 text-sm transition">Terms</a>
              <a href="#" className="text-gray-400 hover:text-purple-400 text-sm transition">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-purple-400 text-sm transition">Help</a>
              <a href="#" className="text-gray-400 hover:text-purple-400 text-sm transition">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const EyeIcon = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const ThumbsUpIcon = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M7 10v12" />
    <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
  </svg>
);

const MessageSquareIcon = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

function abbreviateNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}