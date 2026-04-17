import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  { questionId: String, answer: String, correct: Boolean },
  { _id: false },
);

const attemptSchema = new mongoose.Schema(
  {
    _id: String,
    quiz: { type: String, ref: "QuizModel" },
    user: { type: String, ref: "UserModel" },
    answers: [answerSchema],
    score: { type: Number, default: 0 },
    maxScore: { type: Number, default: 0 },
    submittedAt: Date,
    attemptNumber: { type: Number, default: 1 },
  },
  { collection: "attempts" },
);

export default attemptSchema;
