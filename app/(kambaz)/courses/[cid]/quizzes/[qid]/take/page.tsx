"use client";
import { useParams, useRouter } from "next/navigation";
import { BsCheckLg, BsChevronLeft, BsChevronRight, BsXLg } from "react-icons/bs";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/(kambaz)/store";
import { Quiz, Question } from "../../reducer";
import * as client from "../../client";

export default function QuizTake() {
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
  const [result, setResult] = useState<any>(null);
  const [attemptCount, setAttemptCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [accessCodeInput, setAccessCodeInput] = useState("");
  const [accessGranted, setAccessGranted] = useState(false);
  const [accessError, setAccessError] = useState(false);

  useEffect(() => {
    const init = async () => {
      let loadedQuiz = quiz;
      if (!loadedQuiz) {
        loadedQuiz = await client.findQuizById(quizId);
        setQuiz(loadedQuiz);
      }
      if (loadedQuiz && !loadedQuiz.accessCode) {
        setAccessGranted(true);
      }
      const lastAttempt = await client.getLastAttempt(quizId);
      const { count } = await client.getAttemptCount(quizId);
      setAttemptCount(count);
      if (lastAttempt) {
        setResult(lastAttempt);
        setSubmitted(true);
        setAccessGranted(true);
        const prevAnswers: Record<string, string> = {};
        (lastAttempt.answers || []).forEach((a: any) => {
          prevAnswers[a.questionId] = a.answer;
        });
        setAnswers(prevAnswers);
      }
    };
    init();
  }, [quizId]);

  if (!quiz) return <div className="p-3">Loading...</div>;

  const questions = quiz.questions || [];
  const maxAttempts = quiz.multipleAttempts ? quiz.howManyAttempts : 1;
  const canRetake = attemptCount < maxAttempts;

  const handleAccessCodeSubmit = () => {
    if (accessCodeInput === quiz.accessCode) {
      setAccessGranted(true);
      setAccessError(false);
    } else {
      setAccessError(true);
    }
  };

  const setAnswer = (questionId: string, answer: string) =>
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = questions.map((q) => ({ questionId: q._id, answer: answers[q._id] || "" }));
      const attempt = await client.submitQuiz(quizId, payload);
      setResult(attempt);
      setSubmitted(true);
      setAttemptCount((c) => c + 1);
    } catch (err: any) {
      alert(err?.response?.data?.error || "Submission failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleRetake = () => {
    setAnswers({});
    setResult(null);
    setSubmitted(false);
    setCurrentIdx(0);
  };

  const getAnswerResult = (qId: string) =>
    result?.answers?.find((a: any) => a.questionId === qId);

  const renderQuestion = (q: Question, idx: number) => {
    const res = getAnswerResult(q._id);
    const borderClass = submitted && res ? (res.correct ? "border-success" : "border-danger") : "";
    return (
      <div key={q._id} className={`card mb-3 ${borderClass}`} style={{ borderWidth: submitted ? 2 : 1 }}>
        <div className="card-header d-flex justify-content-between">
          <span className="fw-bold">Question {idx + 1}</span>
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
                    {submitted && c._id === q.correctAnswer && (
                      <span className="text-success ms-2 fw-bold"><BsCheckLg className="me-1" />Correct Answer</span>
                    )}
                  </label>
                </div>
              ))}
            </div>
          )}
          {q.type === "TRUE_FALSE" && (
            <div>
              {(["true", "false"] as const).map((val) => (
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
                    {submitted && val === q.correctAnswer && (
                      <span className="text-success ms-2 fw-bold"><BsCheckLg className="me-1" />Correct Answer</span>
                    )}
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
              {res.correct ? <><BsCheckLg className="me-1" />Correct</> : <><BsXLg className="me-1" />Incorrect</>}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (!accessGranted) {
    return (
      <div id="wd-quiz-take" className="p-3" style={{ maxWidth: 500 }}>
        <h3>{quiz.title}</h3>
        <hr />
        <div className="mb-3">
          <label className="form-label fw-bold">This quiz requires an access code.</label>
          <input
            className={`form-control ${accessError ? "is-invalid" : ""}`}
            placeholder="Enter access code"
            value={accessCodeInput}
            onChange={(e) => { setAccessCodeInput(e.target.value); setAccessError(false); }}
            onKeyDown={(e) => e.key === "Enter" && handleAccessCodeSubmit()}
          />
          {accessError && <div className="invalid-feedback">Incorrect access code. Please try again.</div>}
        </div>
        <button className="btn btn-danger" onClick={handleAccessCodeSubmit}>Submit</button>
        <button className="btn btn-secondary ms-2" onClick={() => router.push(`/courses/${courseId}/quizzes/${quizId}`)}>
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div id="wd-quiz-take" className="p-3">
      <h3>{quiz.title}</h3>
      {quiz.description && <p className="text-muted">{quiz.description}</p>}

      {submitted && result && (
        <div className="alert alert-info">
          Score: <strong>{result.score} / {result.maxScore}</strong>
          {" — Attempt "}{result.attemptNumber} of {maxAttempts}
        </div>
      )}

      <hr />

      {quiz.oneQuestionAtATime && !submitted ? (
        <div>
          <div className="d-flex flex-wrap gap-2 mb-3">
            {questions.map((_, i) => (
              <button
                key={i}
                className={`btn btn-sm ${i === currentIdx ? "btn-danger" : "btn-outline-secondary"}`}
                onClick={() => setCurrentIdx(i)}
              >
                {i + 1}
              </button>
            ))}
          </div>
          {questions.length > 0 && renderQuestion(questions[currentIdx], currentIdx)}
          <div className="d-flex justify-content-between mt-3">
            <button
              className="btn btn-secondary"
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx((i) => i - 1)}
            >
              <BsChevronLeft className="me-1" />Previous
            </button>
            {currentIdx < questions.length - 1 ? (
              <button className="btn btn-secondary" onClick={() => setCurrentIdx((i) => i + 1)}>
                Next <BsChevronRight className="ms-1" />
              </button>
            ) : (
              <button className="btn btn-danger" onClick={handleSubmit} disabled={loading}>
                {loading ? "Submitting..." : "Submit Quiz"}
              </button>
            )}
          </div>
        </div>
      ) : (
        <div>
          {questions.map((q, idx) => renderQuestion(q, idx))}
          {!submitted && questions.length > 0 && (
            <div className="text-end mt-3">
              <button className="btn btn-danger" onClick={handleSubmit} disabled={loading}>
                {loading ? "Submitting..." : "Submit Quiz"}
              </button>
            </div>
          )}
        </div>
      )}

      {submitted && (
        <div className="d-flex gap-2 mt-3">
          <button
            className="btn btn-secondary"
            onClick={() => router.push(`/courses/${courseId}/quizzes/${quizId}`)}
          >
            Back to Quiz Details
          </button>
          {canRetake && (
            <button className="btn btn-outline-danger" onClick={handleRetake}>
              Retake Quiz ({maxAttempts - attemptCount} attempt{maxAttempts - attemptCount !== 1 ? "s" : ""} remaining)
            </button>
          )}
        </div>
      )}
    </div>
  );
}
