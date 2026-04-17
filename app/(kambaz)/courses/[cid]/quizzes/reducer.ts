import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

export type Choice = { _id: string; text: string };

export type Question = {
  _id: string;
  type: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "FILL_IN_BLANK";
  title: string;
  question: string;
  points: number;
  choices?: Choice[];
  correctAnswer?: string;
  possibleAnswers?: string[];
};

export type Quiz = {
  _id: string;
  course: string;
  title: string;
  description: string;
  quizType: string;
  assignmentGroup: string;
  shuffleAnswers: boolean;
  timeLimit: number;
  timeLimitEnabled: boolean;
  multipleAttempts: boolean;
  howManyAttempts: number;
  showCorrectAnswers: string;
  accessCode: string;
  oneQuestionAtATime: boolean;
  webcamRequired: boolean;
  lockQuestionsAfterAnswering: boolean;
  dueDate?: string;
  availableDate?: string;
  untilDate?: string;
  published: boolean;
  questions: Question[];
  lastScore?: number | null;
  lastMaxScore?: number | null;
};

export const defaultQuiz = (courseId: string): Omit<Quiz, "_id"> => ({
  course: courseId,
  title: "Unnamed Quiz",
  description: "",
  quizType: "GRADED_QUIZ",
  assignmentGroup: "QUIZZES",
  shuffleAnswers: true,
  timeLimit: 20,
  timeLimitEnabled: true,
  multipleAttempts: false,
  howManyAttempts: 1,
  showCorrectAnswers: "immediately",
  accessCode: "",
  oneQuestionAtATime: true,
  webcamRequired: false,
  lockQuestionsAfterAnswering: false,
  published: false,
  questions: [],
});

export const defaultQuestion = (): Question => ({
  _id: uuidv4(),
  type: "MULTIPLE_CHOICE",
  title: "",
  question: "",
  points: 1,
  choices: [
    { _id: uuidv4(), text: "" },
    { _id: uuidv4(), text: "" },
  ],
  correctAnswer: "",
  possibleAnswers: [""],
});

const quizzesSlice = createSlice({
  name: "quizzes",
  initialState: { quizzes: [] as Quiz[] },
  reducers: {
    setQuizzes: (state, { payload }) => { state.quizzes = payload; },
    addQuiz: (state, { payload }) => { state.quizzes.push(payload); },
    updateQuiz: (state, { payload }) => {
      state.quizzes = state.quizzes.map((q) => (q._id === payload._id ? payload : q));
    },
    deleteQuiz: (state, { payload: quizId }) => {
      state.quizzes = state.quizzes.filter((q) => q._id !== quizId);
    },
  },
});

export const { setQuizzes, addQuiz, updateQuiz, deleteQuiz } = quizzesSlice.actions;
export default quizzesSlice.reducer;
