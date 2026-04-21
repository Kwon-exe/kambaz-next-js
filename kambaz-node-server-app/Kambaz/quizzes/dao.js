// dao.js — Data Access Object for quizzes
// All direct Mongoose queries for the quizzes collection live here; called by routes.js
import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export default function QuizzesDao() {
  function findQuizzesForCourse(courseId) {
    return model.find({ course: courseId });
  }

  function findQuizById(quizId) {
    return model.findOne({ _id: quizId });
  }

  function createQuiz(quiz) {
    const newQuiz = { ...quiz, _id: uuidv4() };
    return model.create(newQuiz);
  }

  async function updateQuiz(quizId, updates) {
    await model.updateOne({ _id: quizId }, { $set: updates });
    return model.findOne({ _id: quizId });
  }

  function deleteQuiz(quizId) {
    return model.deleteOne({ _id: quizId });
  }

  return { findQuizzesForCourse, findQuizById, createQuiz, updateQuiz, deleteQuiz };
}
