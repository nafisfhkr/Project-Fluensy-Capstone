// ============================================================
// FILE: src/services/dashboardService.ts
// ============================================================

import axiosInstance from "@/lib/axios";
import API_CONFIG from "@/config/api";
import type { DashboardStats, Creator, Message } from "@/types";

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const res = await axiosInstance.get<DashboardStats>(
    API_CONFIG.ENDPOINTS.DASHBOARD_STATS
  );
  return res.data;
}

export async function fetchSavedCreators(): Promise<Creator[]> {
  const res = await axiosInstance.get<Creator[]>(
    API_CONFIG.ENDPOINTS.SAVED_CREATORS
  );
  return res.data;
}

export async function fetchMessages(): Promise<Message[]> {
  const res = await axiosInstance.get<Message[]>(
    API_CONFIG.ENDPOINTS.MESSAGES
  );
  return res.data;
}