"use client";

import { Children, useState } from "react";
import { SendHorizontal, Loader2, BookOpen, Youtube, Sparkles, ChevronDown, ChevronUp, Check, X } from "lucide-react";
import axios, { AxiosError } from "axios";
import { getTeachingPrompt, TeachingStyle } from '@/components/GeminiResponse/SystemPrompt'
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
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizReady, setQuizReady] = useState(false);

  interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswer: string;
    explanation?: string;
  }

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

  const generateQuizPrompt = (topic: string) => {
    return `Generate a short quiz with 3 multiple choice questions about "${topic}". 
    Format each question exactly like this example:
    
    Question: What is the capital of France?
    Options: A) London, B) Paris, C) Berlin, D) Madrid
    Correct Answer: B) Paris
    Explanation: Paris has been the capital of France since the 5th century.
    
    Ensure all questions are directly related to "${topic}" and vary in difficulty. 
    Provide clear explanations for each correct answer.`;
  };

  const parseQuizResponse = (text: string): QuizQuestion[] => {
    const questions: QuizQuestion[] = [];
    const questionBlocks = text.split('\n\n').filter(block => block.includes('Question:'));

    questionBlocks.forEach(block => {
      const lines = block.split('\n');
      const question = lines[0].replace('Question: ', '').trim();
      
      const optionsLine = lines.find(line => line.startsWith('Options: '));
      const options = optionsLine 
        ? optionsLine.replace('Options: ', '').split(', ').map(opt => opt.trim())
        : [];
      
      const correctAnswerLine = lines.find(line => line.startsWith('Correct Answer: '));
      const correctAnswer = correctAnswerLine 
        ? correctAnswerLine.replace('Correct Answer: ', '').trim()
        : '';
      
      const explanationLine = lines.find(line => line.startsWith('Explanation: '));
      const explanation = explanationLine 
        ? explanationLine.replace('Explanation: ', '').trim()
        : '';

      if (question && options.length > 0 && correctAnswer) {
        questions.push({
          question,
          options,
          correctAnswer,
          explanation
        });
      }
    });

    return questions.slice(0, 3); 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputData.trim()) return;

    setIsLoading(true);
    setIsFetchingVideos(true);
    setResponse("");
    setVideos([]);
    setVideoStats({});
    setAnimateResponse(false);
    setQuizQuestions([]);
    setShowQuiz(false);
    setUserAnswers({});
    setQuizSubmitted(false);
    setQuizReady(false);

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

      const quizResponse = await axios.post(GEMINI_API_URL, {
        contents: [{
          parts: [{
            text: generateQuizPrompt(inputData)
          }]
        }]
      });

      const quizData = quizResponse.data as GeminiResponse;
      if (quizData.candidates?.[0]?.content?.parts?.[0]?.text) {
        const parsedQuestions = parseQuizResponse(quizData.candidates[0].content.parts[0].text);
        setQuizQuestions(parsedQuestions);
        setQuizReady(true);
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

  const handleAnswerSelect = (questionIndex: number, answer: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };

  const submitQuiz = () => {
    setQuizSubmitted(true);
  };

  const resetQuiz = () => {
    setUserAnswers({});
    setQuizSubmitted(false);
  };

  const calculateScore = () => {
    return quizQuestions.reduce((score, question, index) => {
      return score + (userAnswers[index] === question.correctAnswer ? 1 : 0);
    }, 0);
  };

  return (
    <div className="min-h-screen flex flex-col bg-black relative">
      <div className="absolute inset-0 [background-image:linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:40px_40px]"></div>

      <nav>
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
              <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/30 shadow-lg animate-pulse">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-slate-700"></div>
                  <div>
                    <div className="h-5 w-32 bg-slate-700 rounded"></div>
                    <div className="h-3 w-24 bg-slate-700 rounded mt-2"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-slate-700 rounded w-full"></div>
                  <div className="h-4 bg-slate-700 rounded w-full"></div>
                  <div className="h-4 bg-slate-700 rounded w-5/6"></div>
                  <div className="h-4 bg-slate-700 rounded w-3/4"></div>
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

                      {quizReady && (
                        <div className="mt-10 pt-6 border-t border-slate-700/50">
                          <div className="flex items-center justify-between">
                            <button
                              onClick={() => setShowQuiz(!showQuiz)}
                              className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
                            >
                              <span className="font-medium">Test Your Understanding</span>
                              {showQuiz ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </button>
                            <div className="bg-purple-500/20 py-1 px-3 rounded-full text-purple-300 text-xs font-medium">
                              {quizQuestions.length} Questions
                            </div>
                          </div>

                          {showQuiz && (
                            <div className="bg-slate-800/50 rounded-xl p-6 mt-4">
                              <h4 className="text-lg font-semibold text-white mb-4">
                                Quick Quiz
                              </h4>

                              <div className="space-y-6">
                                {quizQuestions.map((question, qIndex) => (
                                  <div key={qIndex} className="bg-slate-800/70 rounded-lg p-4">
                                    <h5 className="text-white font-medium mb-3">{question.question}</h5>
                                    <div className="space-y-2">
                                      {question.options.map((option, oIndex) => {
                                        const isSelected = userAnswers[qIndex] === option;
                                        const isCorrect = option === question.correctAnswer;
                                        const showCorrectness = quizSubmitted && isCorrect;
                                        const showIncorrectness = quizSubmitted && isSelected && !isCorrect;

                                        return (
                                          <div 
                                            key={oIndex}
                                            onClick={() => !quizSubmitted && handleAnswerSelect(qIndex, option)}
                                            className={`p-3 rounded-lg cursor-pointer border transition-all ${
                                              !quizSubmitted 
                                                ? isSelected
                                                  ? 'bg-purple-900/30 border-purple-500' 
                                                  : 'border-slate-600 hover:border-purple-500 hover:bg-slate-700/50'
                                                : isCorrect 
                                                  ? 'border-green-500 bg-green-900/20'
                                                  : isSelected && !isCorrect
                                                    ? 'border-red-500 bg-red-900/20'
                                                    : 'border-slate-600'
                                            }`}
                                          >
                                            <div className="flex items-center gap-3">
                                              {quizSubmitted && (
                                                <div className="flex-shrink-0">
                                                  {showCorrectness && (
                                                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                                                      <Check size={14} className="text-white" />
                                                    </div>
                                                  )}
                                                  {showIncorrectness && (
                                                    <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                                                      <X size={14} className="text-white" />
                                                    </div>
                                                  )}
                                                </div>
                                              )}
                                              <span className="text-gray-200">{option}</span>
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>

                                    {quizSubmitted && (
                                      <div className="mt-3 text-sm text-gray-400">
                                        <p>{question.explanation}</p>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>

                              <div className="mt-6 flex items-center justify-between">
                                {!quizSubmitted ? (
                                  <button
                                    onClick={submitQuiz}
                                    disabled={Object.keys(userAnswers).length < quizQuestions.length}
                                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    Submit Answers
                                  </button>
                                ) : (
                                  <>
                                    <div className="text-white font-medium">
                                      Your Score: <span className="text-purple-400">{calculateScore()}</span> out of {quizQuestions.length}
                                    </div>
                                    <button
                                      onClick={resetQuiz}
                                      className="text-purple-400 hover:text-purple-300 flex items-center gap-1"
                                    >
                                      Try again
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}

                  {videos.length > 0 && (
                    <div className="mt-10 pt-6 border-t border-slate-700/50">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-amber-500 flex items-center justify-center">
                          <Youtube className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-white">Recommended Videos</h3>
                          <p className="text-sm text-gray-400">Curated content to deepen your knowledge</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {videos.map((video) => (
                          <a 
                            key={video.id.videoId}
                            href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/50 rounded-lg overflow-hidden transition-all hover:shadow-lg hover:shadow-purple-900/20 hover:scale-[1.02]"
                          >
                            <div className="relative pb-[56.25%]">
                              <img 
                                src={video.snippet.thumbnails.default.url} 
                                alt={video.snippet.title}
                                className="absolute inset-0 w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                              <div className="absolute bottom-0 left-0 p-3">
                                <h4 className="text-white font-medium text-sm line-clamp-2">
                                  {video.snippet.title}
                                </h4>
                                <p className="text-gray-400 text-xs mt-1">
                                  {video.snippet.title}
                                </p>
                              </div>
                            </div>
                            <div className="p-3 flex items-center justify-between text-xs">
                              <div className="flex items-center gap-4">
                                {videoStats[video.id.videoId] && (
                                  <>
                                    <div className="flex items-center text-gray-400">
                                      <EyeIcon className="w-3 h-3 mr-1" />
                                      <span>{abbreviateNumber(parseInt(videoStats[video.id.videoId].viewCount))}</span>
                                    </div>
                                    <div className="flex items-center text-gray-400">
                                      <ThumbsUpIcon className="w-3 h-3 mr-1" />
                                      <span>{abbreviateNumber(parseInt(videoStats[video.id.videoId].likeCount))}</span>
                                    </div>
                                  </>
                                )}
                              </div>  
                              <span className="text-gray-500">
                                {new Date(video.snippet.publishedAt).toLocaleDateString()}
                              </span>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            )}
          </section>
        </div>
      </main>
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