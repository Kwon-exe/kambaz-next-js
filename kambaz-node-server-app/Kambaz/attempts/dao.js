import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export default function AttemptsDao() {
  function findLastAttempt(quizId, userId) {
    return model.findOne({ quiz: quizId, user: userId }).sort({ attemptNumber: -1 });
  }

  function countAttempts(quizId, userId) {
    return model.countDocuments({ quiz: quizId, user: userId });
  }

  function createAttempt(attempt) {
    const newAttempt = { ...attempt, _id: uuidv4() };
    return model.create(newAttempt);
  }

  return { findLastAttempt, countAttempts, createAttempt };
}
