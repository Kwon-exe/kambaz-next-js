// API client for quizzes — all axios calls to the backend (GET, POST, PUT, DELETE, submit, attempts)
import axios from "axios";

// all requests include session cookie for auth (req.session.currentUser on backend)
const axiosWithCredentials = axios.create({ withCredentials: true });
// base URL set via NEXT_PUBLIC_HTTP_SERVER env variable
const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
const COURSES_API = `${HTTP_SERVER}/api/courses`;
const QUIZZES_API = `${HTTP_SERVER}/api/quizzes`;

// students only receive published quizzes (filtered server-side in routes.js)
export const findQuizzesForCourse = async (courseId: string) => {
  const response = await axiosWithCredentials.get(`${COURSES_API}/${courseId}/quizzes`);
  return response.data;
};

export const findQuizById = async (quizId: string) => {
  const response = await axiosWithCredentials.get(`${QUIZZES_API}/${quizId}`);
  return response.data;
};

// returns 403 if user is not FACULTY
export const createQuiz = async (courseId: string, quiz: any) => {
  const response = await axiosWithCredentials.post(`${COURSES_API}/${courseId}/quizzes`, quiz);
  return response.data;
};

export const updateQuiz = async (quiz: any) => {
  const response = await axiosWithCredentials.put(`${QUIZZES_API}/${quiz._id}`, quiz);
  return response.data;
};

export const deleteQuiz = async (quizId: string) => {
  const response = await axiosWithCredentials.delete(`${QUIZZES_API}/${quizId}`);
  return response.data;
};

// scoring done server-side; attempt saved to DB per student
export const submitQuiz = async (quizId: string, answers: any[]) => {
  const response = await axiosWithCredentials.post(`${QUIZZES_API}/${quizId}/submit`, { answers });
  return response.data;
};

// used to pre-fill answers and show score when student returns to a completed quiz
export const getLastAttempt = async (quizId: string) => {
  const response = await axiosWithCredentials.get(`${QUIZZES_API}/${quizId}/attempts/last`);
  return response.data;
};

export const getAttemptCount = async (quizId: string) => {
  const response = await axiosWithCredentials.get(`${QUIZZES_API}/${quizId}/attempts/count`);
  return response.data;
};
