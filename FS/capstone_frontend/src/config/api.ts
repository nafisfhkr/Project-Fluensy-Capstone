// ============================================================
// FILE: src/config/api.ts
// Ganti BASE_URL dengan URL backend asli saat sudah siap.
// ============================================================

interface ApiConfig {
  BASE_URL: string;
  ENDPOINTS: {
    DASHBOARD_STATS: string;
    SAVED_CREATORS: string;
    MESSAGES: string;
  };
  TIMEOUT: number;
}

const API_CONFIG: ApiConfig = {
  // Ganti ini saat backend siap:
  // BASE_URL: "https://api.fluensy.com/v1",
  BASE_URL: "/api/mock",

  ENDPOINTS: {
    DASHBOARD_STATS: "/dashboard/stats",
    SAVED_CREATORS: "/creators/saved",
    MESSAGES: "/messages",
  },

  TIMEOUT: 8000,
};

export default API_CONFIG;