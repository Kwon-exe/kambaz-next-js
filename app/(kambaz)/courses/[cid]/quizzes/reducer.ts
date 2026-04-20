// Redux slice for quizzes — defines Quiz/Question types, default values, and state actions
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

// full quiz object — mirrors the MongoDB schema in kambaz-node-server-app/Kambaz/quizzes/schema.js
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
  lastScore?: number | null;     // injected by server for students (last attempt)
  lastMaxScore?: number | null;
};

// used when faculty clicks "+Quiz" — all fields editable in the editor
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

// used when "+ New Question" is clicked in the questions tab
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

// redux slice — registered in app/(kambaz)/store.ts as quizzesReducer
const quizzesSlice = createSlice({
  name: "quizzes",
  initialState: { quizzes: [] as Quiz[] },
  reducers: {
    setQuizzes: (state, { payload }) => { state.quizzes = payload; },       // replaces full list on page load
    addQuiz: (state, { payload }) => { state.quizzes.push(payload); },       // after createQuiz API call
    updateQuiz: (state, { payload }) => {                                    // after updateQuiz API call
      state.quizzes = state.quizzes.map((q) => (q._id === payload._id ? payload : q));
    },
    deleteQuiz: (state, { payload: quizId }) => {                            // after deleteQuiz API call
      state.quizzes = state.quizzes.filter((q) => q._id !== quizId);
    },
  },
});

export const { setQuizzes, addQuiz, updateQuiz, deleteQuiz } = quizzesSlice.actions;
export default quizzesSlice.reducer;
