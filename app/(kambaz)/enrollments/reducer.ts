import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

type Enrollment = {
  _id: string;
  user: string;
  course: string;
};

type EnrollmentsState = {
  enrollments: Enrollment[];
};

const initialState: EnrollmentsState = {
  enrollments: [],
};

const enrollmentsSlice = createSlice({
  name: "enrollments",
  initialState,
  reducers: {
    setEnrollments: (state, { payload }: { payload: Enrollment[] }) => {
      state.enrollments = payload;
    },
    enroll: (
      state,
      { payload }: { payload: { userId: string; courseId: string } },
    ) => {
      const exists = state.enrollments.some(
        (enrollment) =>
          enrollment.user === payload.userId &&
          enrollment.course === payload.courseId,
      );
      if (!exists) {
        state.enrollments.push({
          _id: uuidv4(),
          user: payload.userId,
          course: payload.courseId,
        });
      }
    },
    unenroll: (
      state,
      { payload }: { payload: { userId: string; courseId: string } },
    ) => {
      state.enrollments = state.enrollments.filter(
        (enrollment) =>
          !(
            enrollment.user === payload.userId &&
            enrollment.course === payload.courseId
          ),
      );
    },
  },
});

export const { setEnrollments, enroll, unenroll } = enrollmentsSlice.actions;
export default enrollmentsSlice.reducer;
