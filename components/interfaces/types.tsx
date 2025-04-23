export interface GeminiResponse {
    candidates?: {
      content: {
        parts: {
          text: string;
        }[];
      };
    }[];
    error?: string;
}

export interface YoutubeVideoItem {
    id: {
      videoId: string;
    };
    snippet: {
      title: string;
      thumbnails: {
        default: {
          url: string;
        };
      };
    };
}
  
export interface YoutubeAnalytics {
    id: string;
    statistics: {
      viewCount: string;
      likeCount: string;
      favoriteCount: string;
      commentCount: string;
    };
}

export interface YoutubeAnalyticsResponse {
    items: YoutubeAnalytics[];
}
  
export interface YoutubeVideoResponse {
    items: YoutubeVideoItem[];
}