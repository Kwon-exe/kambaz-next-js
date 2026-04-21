// model.js — Mongoose model for quizzes
// Binds the quizSchema to the "quizzes" collection; imported by dao.js for all DB operations
import mongoose from "mongoose";
import schema from "./schema.js";

const model = mongoose.model("QuizModel", schema);
export default model;
