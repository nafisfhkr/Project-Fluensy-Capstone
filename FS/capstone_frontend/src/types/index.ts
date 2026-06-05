// ============================================================
// FILE: src/types/index.ts
// Central type definitions for Fluensy app
// ============================================================

export interface DashboardStats {
  totalCampaigns: string;
  totalReach: string;
  engagementRate: string;
  budgetUsed: string;
  roi: string;
}

export interface Creator {
  id: number;
  name: string;
  handle: string;
  location: string;
  category: string;
  followers: string;
  engagement: string;
  avgViews: string;
  avatar: string;
  platformIcons: string[];
  recentContent: ContentPost[];
  saved?: boolean;
}

export interface ContentPost {
  id: number;
  imageUrl: string;
  type: "video" | "image";
}

export interface Message {
  id: number;
  name: string;
  avatar: string;
  preview: string;
}

export interface SavedCreatorsResponse {
  id: number;
  name: string;
  handle: string;
  location: string;
  category: string;
  followers: string;
  avatar: string;
}

export interface ApiError {
  message: string;
}