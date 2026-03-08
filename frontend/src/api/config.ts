export const API_BASE_URL = 'http://localhost:5001/api';

export const apiCall = async (endpoint: string, options?: RequestInit) => {
  const token = localStorage.getItem('authToken');

  // Explicitly use Record<string, string> to satisfy TypeScript
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options?.headers as Record<string, string>,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`; // ✅ use bracket notation
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
};