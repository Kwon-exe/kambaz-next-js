import { configureStore } from "@reduxjs/toolkit";
import coursesReducer from "./courses/reducer";
import modulesReducer from "./courses/[cid]/modules/reducer";
import assignmentsReducer from "./courses/[cid]/assignments/reducer";
import accountReducer from "./account/reducer";
import enrollmentsReducer from "./enrollments/reducer";
import quizzesReducer from "./courses/[cid]/quizzes/reducer";

const ENROLLMENTS_STORAGE_KEY = "kambaz.enrollments";

type Enrollment = {
  _id: string;
  user: string;
  course: string;
};

const loadPersistedEnrollments = (): Enrollment[] | null => {
  if (typeof window === "undefined") return null;
  const serialized = window.localStorage.getItem(ENROLLMENTS_STORAGE_KEY);
  if (!serialized) return null;

  try {
    const parsed = JSON.parse(serialized);
    if (!Array.isArray(parsed)) return null;
    return parsed.filter(
      (enrollment): enrollment is Enrollment =>
        enrollment &&
        typeof enrollment._id === "string" &&
        typeof enrollment.user === "string" &&
        typeof enrollment.course === "string",
    );
  } catch {
    return null;
  }
};

const persistedEnrollments = loadPersistedEnrollments();

const store = configureStore({
  reducer: {
    coursesReducer,
    modulesReducer,
    assignmentsReducer,
    accountReducer,
    enrollmentsReducer,
    quizzesReducer,
  },
  preloadedState: persistedEnrollments
    ? {
        enrollmentsReducer: {
          enrollments: persistedEnrollments,
        },
      }
    : undefined,
});

if (typeof window !== "undefined") {
  store.subscribe(() => {
    const { enrollments } = store.getState().enrollmentsReducer;
    window.localStorage.setItem(
      ENROLLMENTS_STORAGE_KEY,
      JSON.stringify(enrollments),
    );
  });
}

export type RootState = ReturnType<typeof store.getState>;
export default store;
