"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/(kambaz)/store";
import { Quiz, Question } from "../../reducer";
import * as client from "../../client";

export default function QuizPreview() {
  const { cid, qid } = useParams<{ cid: string | string[]; qid: string | string[] }>();
  const courseId = Array.isArray(cid) ? cid[0] : cid;
  const quizId = Array.isArray(qid) ? qid[0] : qid;
  const router = useRouter();
  const { quizzes } = useSelector((state: RootState) => state.quizzesReducer);
  const [quiz, setQuiz] = useState<Quiz | null>(
    quizzes.find((q: Quiz) => q._id === quizId) ?? null,
  );
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<{ score: number; maxScore: number; answers: any[] } | null>(null);

  useEffect(() => {
    if (!quiz) client.findQuizById(quizId).then(setQuiz);
  }, [quizId]);

  if (!quiz) return <div className="p-3">Loading...</div>;

  const questions = quiz.questions;

  const setAnswer = (questionId: string, answer: string) =>
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));

  const handleSubmit = () => {
    let score = 0;
    let maxScore = 0;
    const scored = questions.map((q) => {
      maxScore += q.points || 0;
      const answer = answers[q._id] || "";
      let correct = false;
      if (q.type === "MULTIPLE_CHOICE" || q.type === "TRUE_FALSE") {
        correct = answer === q.correctAnswer;
      } else if (q.type === "FILL_IN_BLANK") {
        correct = (q.possibleAnswers || []).some(
          (pa) => pa.toLowerCase() === answer.toLowerCase(),
        );
      }
      if (correct) score += q.points || 0;
      return { questionId: q._id, answer, correct };
    });
    setResult({ score, maxScore, answers: scored });
    setSubmitted(true);
  };

  const getAnswerResult = (qId: string) =>
    result?.answers.find((a) => a.questionId === qId);

  const renderQuestion = (q: Question, idx: number) => {
    const res = getAnswerResult(q._id);
    const borderClass = submitted && res ? (res.correct ? "border-success" : "border-danger") : "";
    return (
      <div key={q._id} className={`card mb-3 ${borderClass}`} style={{ borderWidth: submitted ? 2 : 1 }}>
        <div className="card-header d-flex justify-content-between">
          <span>Question {idx + 1}</span>
          <span>{q.points} pt{q.points !== 1 ? "s" : ""}</span>
        </div>
        <div className="card-body">
          <p>{q.question || "(No question text)"}</p>
          {q.type === "MULTIPLE_CHOICE" && (
            <div>
              {(q.choices || []).map((c) => (
                <div key={c._id} className="form-check">
                  <input
                    type="radio"
                    className="form-check-input"
                    id={`${q._id}-${c._id}`}
                    name={q._id}
                    value={c._id}
                    checked={answers[q._id] === c._id}
                    onChange={() => !submitted && setAnswer(q._id, c._id)}
                    disabled={submitted}
                  />
                  <label className="form-check-label" htmlFor={`${q._id}-${c._id}`}>
                    {c.text}
                    {submitted && c._id === q.correctAnswer && <span className="text-success ms-2">✓ Correct Answer</span>}
                  </label>
                </div>
              ))}
            </div>
          )}
          {q.type === "TRUE_FALSE" && (
            <div>
              {["true", "false"].map((val) => (
                <div key={val} className="form-check">
                  <input
                    type="radio"
                    className="form-check-input"
                    id={`${q._id}-${val}`}
                    name={q._id}
                    value={val}
                    checked={answers[q._id] === val}
                    onChange={() => !submitted && setAnswer(q._id, val)}
                    disabled={submitted}
                  />
                  <label className="form-check-label" htmlFor={`${q._id}-${val}`}>
                    {val === "true" ? "True" : "False"}
                    {submitted && val === q.correctAnswer && <span className="text-success ms-2">✓ Correct Answer</span>}
                  </label>
                </div>
              ))}
            </div>
          )}
          {q.type === "FILL_IN_BLANK" && (
            <div>
              <input
                className="form-control"
                style={{ maxWidth: 300 }}
                value={answers[q._id] || ""}
                onChange={(e) => !submitted && setAnswer(q._id, e.target.value)}
                disabled={submitted}
                placeholder="Your answer"
              />
              {submitted && (
                <div className="mt-1 text-muted small">
                  Accepted: {(q.possibleAnswers || []).join(", ")}
                </div>
              )}
            </div>
          )}
          {submitted && res && (
            <div className={`mt-2 small fw-bold ${res.correct ? "text-success" : "text-danger"}`}>
              {res.correct ? "✓ Correct" : "✗ Incorrect"}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div id="wd-quiz-preview" className="p-3">
      <div className="alert alert-warning">
        ⚠️ This is a preview of the published version of the quiz.
      </div>
      <h3>{quiz.title}</h3>
      {quiz.description && <p>{quiz.description}</p>}
      <hr />

      {submitted && result && (
        <div className="alert alert-info mb-3">
          Score: <strong>{result.score} / {result.maxScore}</strong>
        </div>
      )}

      {quiz.oneQuestionAtATime && !submitted ? (
        <div>
          {questions.length > 0 && renderQuestion(questions[currentIdx], currentIdx)}
          <div className="d-flex justify-content-between mt-3">
            <button
              className="btn btn-secondary"
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx((i) => i - 1)}
            >
              ◀ Previous
            </button>
            {currentIdx < questions.length - 1 ? (
              <button className="btn btn-secondary" onClick={() => setCurrentIdx((i) => i + 1)}>
                Next ▶
              </button>
            ) : (
              <button className="btn btn-danger" onClick={handleSubmit}>
                Submit Quiz
              </button>
            )}
          </div>
        </div>
      ) : (
        <div>
          {questions.map((q, idx) => renderQuestion(q, idx))}
          {!submitted && questions.length > 0 && (
            <div className="text-end mt-3">
              <button className="btn btn-danger" onClick={handleSubmit}>Submit Quiz</button>
            </div>
          )}
        </div>
      )}

      <hr />
      <div className="d-flex gap-2 mt-2">
        <button
          className="btn btn-outline-secondary"
          onClick={() => router.push(`/courses/${courseId}/quizzes/${quizId}/edit`)}
        >
          ✏️ Keep Editing This Quiz
        </button>
      </div>
    </div>
  );
}
