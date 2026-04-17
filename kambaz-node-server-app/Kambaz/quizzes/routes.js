import QuizzesDao from "./dao.js";
import AttemptsDao from "../attempts/dao.js";

export default function QuizzesRoutes(app, db) {
  const quizzesDao = QuizzesDao();
  const attemptsDao = AttemptsDao();

  const findQuizzesForCourse = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) { res.sendStatus(401); return; }
    const { courseId } = req.params;
    const quizzes = await quizzesDao.findQuizzesForCourse(courseId);
    if (currentUser.role === "STUDENT") {
      const published = quizzes.filter((q) => q.published);
      const withScores = await Promise.all(
        published.map(async (quiz) => {
          const last = await attemptsDao.findLastAttempt(quiz._id, currentUser._id);
          return { ...quiz.toObject(), lastScore: last ? last.score : null, lastMaxScore: last ? last.maxScore : null };
        }),
      );
      return res.json(withScores);
    }
    res.json(quizzes);
  };

  const findQuizById = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) { res.sendStatus(401); return; }
    const { quizId } = req.params;
    const quiz = await quizzesDao.findQuizById(quizId);
    if (!quiz) { res.sendStatus(404); return; }
    res.json(quiz);
  };

  const createQuiz = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser || currentUser.role !== "FACULTY") { res.sendStatus(403); return; }
    const { courseId } = req.params;
    const quiz = { ...req.body, course: courseId };
    const newQuiz = await quizzesDao.createQuiz(quiz);
    res.json(newQuiz);
  };

  const updateQuiz = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser || currentUser.role !== "FACULTY") { res.sendStatus(403); return; }
    const { quizId } = req.params;
    const updated = await quizzesDao.updateQuiz(quizId, req.body);
    res.json(updated);
  };

  const deleteQuiz = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser || currentUser.role !== "FACULTY") { res.sendStatus(403); return; }
    const { quizId } = req.params;
    const status = await quizzesDao.deleteQuiz(quizId);
    res.send(status);
  };

  const submitAttempt = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) { res.sendStatus(401); return; }
    const { quizId } = req.params;
    const { answers } = req.body;
    const quiz = await quizzesDao.findQuizById(quizId);
    if (!quiz) { res.sendStatus(404); return; }

    if (currentUser.role === "STUDENT") {
      const count = await attemptsDao.countAttempts(quizId, currentUser._id);
      const max = quiz.multipleAttempts ? quiz.howManyAttempts : 1;
      if (count >= max) { res.status(400).json({ error: "No attempts remaining" }); return; }
    }

    let score = 0;
    let maxScore = 0;
    const scoredAnswers = (answers || []).map(({ questionId, answer }) => {
      const question = quiz.questions.find((q) => q._id === questionId);
      if (!question) return { questionId, answer, correct: false };
      maxScore += question.points || 0;
      let correct = false;
      if (question.type === "MULTIPLE_CHOICE" || question.type === "TRUE_FALSE") {
        correct = answer === question.correctAnswer;
      } else if (question.type === "FILL_IN_BLANK") {
        correct = (question.possibleAnswers || []).some(
          (pa) => pa.toLowerCase() === (answer || "").toLowerCase(),
        );
      }
      if (correct) score += question.points || 0;
      return { questionId, answer, correct };
    });

    const count = await attemptsDao.countAttempts(quizId, currentUser._id);
    const attempt = await attemptsDao.createAttempt({
      quiz: quizId,
      user: currentUser._id,
      answers: scoredAnswers,
      score,
      maxScore,
      submittedAt: new Date(),
      attemptNumber: count + 1,
    });
    res.json(attempt);
  };

  const getLastAttempt = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) { res.sendStatus(401); return; }
    const { quizId } = req.params;
    const attempt = await attemptsDao.findLastAttempt(quizId, currentUser._id);
    res.json(attempt || null);
  };

  const getAttemptCount = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) { res.sendStatus(401); return; }
    const { quizId } = req.params;
    const count = await attemptsDao.countAttempts(quizId, currentUser._id);
    res.json({ count });
  };

  app.get("/api/courses/:courseId/quizzes", findQuizzesForCourse);
  app.get("/api/quizzes/:quizId", findQuizById);
  app.post("/api/courses/:courseId/quizzes", createQuiz);
  app.put("/api/quizzes/:quizId", updateQuiz);
  app.delete("/api/quizzes/:quizId", deleteQuiz);
  app.post("/api/quizzes/:quizId/submit", submitAttempt);
  app.get("/api/quizzes/:quizId/attempts/last", getLastAttempt);
  app.get("/api/quizzes/:quizId/attempts/count", getAttemptCount);
}
