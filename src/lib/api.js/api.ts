const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://dev.playasport.in/api/v2';
const COACH_API_URL = process.env.NEXT_PUBLIC_COACH_API_URL || 'https://coachapi.playasport.in/api/v1';

export const API = {
  sports: `${BASE_URL}/sports`,  
  users: `${BASE_URL}/user`,
  academies: `${BASE_URL}/academies`,
  login: `${COACH_API_URL}/login`, // Login API endpoint
  coachApi: COACH_API_URL, // Base URL for coach API
};
