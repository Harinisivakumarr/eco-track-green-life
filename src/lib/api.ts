
import { FootprintFormData, FootprintResult, EcoAction, Report, DailyTip, Suggestion } from '@/types';

// Base URL for our backend API
const API_URL = 'https://api.ecofootprint.app'; // Replace with your actual API URL when deployed

// Helper function for handling API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'An error occurred while fetching data');
  }
  return response.json();
};

// Auth token management
const getAuthHeader = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

// Carbon calculation endpoints
export const calculateFootprint = async (data: FootprintFormData): Promise<FootprintResult> => {
  const response = await fetch(`${API_URL}/calculate-footprint`, {
    method: 'POST',
    headers: getAuthHeader(),
    body: JSON.stringify(data)
  });
  return handleResponse(response);
};

// User progress and points
export const getUserProgress = async (userId: string) => {
  const response = await fetch(`${API_URL}/user-progress?userId=${userId}`, {
    headers: getAuthHeader()
  });
  return handleResponse(response);
};

export const logAction = async (action: Omit<EcoAction, 'id'>): Promise<EcoAction> => {
  const response = await fetch(`${API_URL}/log-action`, {
    method: 'POST',
    headers: getAuthHeader(),
    body: JSON.stringify(action)
  });
  return handleResponse(response);
};

// Reports management
export const getUserReports = async (userId: string): Promise<Report[]> => {
  const response = await fetch(`${API_URL}/user-reports/${userId}`, {
    headers: getAuthHeader()
  });
  return handleResponse(response);
};

export const getReportDownloadUrl = async (fileId: string): Promise<{url: string}> => {
  const response = await fetch(`${API_URL}/download/${fileId}`, {
    headers: getAuthHeader()
  });
  return handleResponse(response);
};

export const uploadReport = async (reportData: FormData): Promise<Report> => {
  const response = await fetch(`${API_URL}/upload-report`, {
    method: 'POST',
    headers: {
      'Authorization': getAuthHeader().Authorization
    },
    body: reportData
  });
  return handleResponse(response);
};

// Daily tip
export const getDailyTip = async (): Promise<DailyTip> => {
  const response = await fetch(`${API_URL}/tips/daily`, {
    headers: getAuthHeader()
  });
  return handleResponse(response);
};

// Suggestions based on NLP
export const submitQuery = async (query: string): Promise<Suggestion[]> => {
  const response = await fetch(`${API_URL}/submit-query`, {
    method: 'POST',
    headers: getAuthHeader(),
    body: JSON.stringify({ query })
  });
  return handleResponse(response);
};

// Mock data for development (until backend is ready)
export const getMockFootprintResult = (): FootprintResult => {
  return {
    totalEmissions: 12.5,
    breakdown: {
      homeEnergy: 3.2,
      transportation: 5.1,
      flights: 2.3,
      diet: 1.5,
      waste: 0.4
    },
    date: new Date()
  };
};

export const getMockProgress = () => {
  return {
    carbonSaved: 450,
    greenPoints: 320,
    monthlyProgress: [
      { month: 'Jan', emissions: 14.2 },
      { month: 'Feb', emissions: 13.8 },
      { month: 'Mar', emissions: 12.5 },
      { month: 'Apr', emissions: 11.9 },
      { month: 'May', emissions: 10.5 },
      { month: 'Jun', emissions: 9.8 },
    ],
    badges: [
      { id: '1', name: 'Carbon Reducer', description: 'Reduced carbon by 100kg', imageUrl: '/badges/reducer.svg', unlockedAt: new Date() },
      { id: '2', name: 'Green Commuter', description: 'Used public transport 20 times', imageUrl: '/badges/commuter.svg', unlockedAt: new Date() },
    ]
  };
};

export const getMockDailyTip = (): DailyTip => {
  return {
    id: '1',
    title: 'Turn off electronics',
    content: 'Unplug chargers and turn off electronics when not in use. This can save up to 10% on your electricity bill and reduce your carbon footprint.',
    category: 'energy-saving',
    difficultyLevel: 'easy',
    potentialImpact: 0.5
  };
};
