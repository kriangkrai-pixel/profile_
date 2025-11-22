export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${API_BASE_URL}/auth/login`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  
  // Profile
  PROFILE: `${API_BASE_URL}/profile`,
  EDUCATION: `${API_BASE_URL}/profile/education`,
  EXPERIENCE: `${API_BASE_URL}/profile/experience`,
  SKILLS: `${API_BASE_URL}/profile/skills`,
  PORTFOLIO: `${API_BASE_URL}/profile/portfolio`,
  
  // Contact
  CONTACT: `${API_BASE_URL}/contact`,
  
  // Layout & Widgets
  LAYOUT: `${API_BASE_URL}/layout`,
  WIDGETS: `${API_BASE_URL}/widgets`,
  
  // Settings
  SETTINGS: `${API_BASE_URL}/settings`,
  
  // Upload
  UPLOAD: `${API_BASE_URL}/upload`,
  UPLOAD_PROFILE: `${API_BASE_URL}/upload/profile`,
  UPLOAD_PORTFOLIO: `${API_BASE_URL}/upload/portfolio`,
  UPLOAD_WIDGET: `${API_BASE_URL}/upload/widget`,
  
  // Edit History
  EDIT_HISTORY: `${API_BASE_URL}/admin/edit-history`,
};

// Helper function for making API calls with credentials
export async function apiRequest(url: string, options?: RequestInit) {
  const defaultOptions: RequestInit = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  };

  const response = await fetch(url, defaultOptions);
  return response;
}

