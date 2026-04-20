"use client";
// Quiz Details screen — shows quiz properties summary; faculty can edit/preview/publish, students can take
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BsPencil } from "react-icons/bs";
import { FaRegCheckCircle } from "react-icons/fa";
import { MdOutlineDoNotDisturb } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/(kambaz)/store";
import { updateQuiz, Quiz } from "../reducer";
import * as client from "../client";

function formatDate(dateStr?: string): string {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "numeric", minute: "2-digit",
  });
}

function boolLabel(val: boolean): string { return val ? "Yes" : "No"; }

export default function QuizDetails() {
  const { cid, qid } = useParams<{ cid: string | string[]; qid: string | string[] }>();
  const courseId = Array.isArray(cid) ? cid[0] : cid;
  const quizId = Array.isArray(qid) ? qid[0] : qid;
  const router = useRouter();
  const dispatch = useDispatch();
  const { quizzes } = useSelector((state: RootState) => state.quizzesReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const isFaculty = (currentUser as any)?.role === "FACULTY";

  const [quiz, setQuiz] = useState<Quiz | null>(
    quizzes.find((q: Quiz) => q._id === quizId) ?? null, // try Redux first, fallback to API
  );
  const [lastAttempt, setLastAttempt] = useState<any>(null);
  const [attemptCount, setAttemptCount] = useState(0);

  useEffect(() => {
    if (!quiz) {
      client.findQuizById(quizId).then(setQuiz); // load if not in Redux store
    }
    if (!isFaculty) {
      // load student's previous attempt info for display
      client.getLastAttempt(quizId).then(setLastAttempt);
      client.getAttemptCount(quizId).then(({ count }) => setAttemptCount(count));
    }
  }, [quizId]);

  const handlePublishToggle = async () => {
    if (!quiz) return;
    const updated = await client.updateQuiz({ ...quiz, published: !quiz.published });
    setQuiz(updated);
    dispatch(updateQuiz(updated));
  };

  if (!quiz) return <div className="p-3">Loading...</div>;

  // points = sum of all question points (not a stored field)
  const totalPoints = (quiz.questions || []).reduce((s, q) => s + (q.points || 0), 0);
  // student can only take if attempts remain
  const maxAttemptsAllowed = quiz.multipleAttempts ? quiz.howManyAttempts : 1;
  const canTake = !isFaculty && attemptCount < maxAttemptsAllowed;

  return (
    <div id="wd-quiz-details" className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex gap-2">
          {isFaculty && (
            <>
              <button
                className="btn btn-secondary"
                onClick={() => router.push(`/courses/${courseId}/quizzes/${quizId}/preview`)}
              >
                Preview
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => router.push(`/courses/${courseId}/quizzes/${quizId}/edit`)}
              >
                <BsPencil className="me-1" /> Edit
              </button>
            </>
          )}
        </div>
        {isFaculty && (
          <button className="btn btn-sm btn-outline-secondary" onClick={handlePublishToggle}>
            {quiz.published ? (
              <><FaRegCheckCircle className="text-success me-1" />Published</>
            ) : (
              <><MdOutlineDoNotDisturb className="text-danger me-1" />Unpublished</>
            )}
          </button>
        )}
      </div>

      <h2>{quiz.title}</h2>
      <hr />

      {!isFaculty && (
        <div className="mb-4">
          {lastAttempt && (
            <div className="alert alert-info">
              Last score: <strong>{lastAttempt.score}/{lastAttempt.maxScore}</strong>
              {" — "}Attempt {lastAttempt.attemptNumber} of {maxAttemptsAllowed}
            </div>
          )}
          {canTake ? (
            <button
              className="btn btn-danger"
              onClick={() => router.push(`/courses/${courseId}/quizzes/${quizId}/take`)}
            >
              Take Quiz
            </button>
          ) : (
            <div className="text-muted">No attempts remaining.</div>
          )}
        </div>
      )}

      <table className="table table-borderless" style={{ maxWidth: 600 }}>
        <tbody>
          <tr>
            <td className="text-end fw-bold pe-4">Quiz Type</td>
            <td>{quiz.quizType.replace(/_/g, " ")}</td>
          </tr>
          <tr>
            <td className="text-end fw-bold pe-4">Points</td>
            <td>{totalPoints}</td>
          </tr>
          <tr>
            <td className="text-end fw-bold pe-4">Assignment Group</td>
            <td>{quiz.assignmentGroup}</td>
          </tr>
          <tr>
            <td className="text-end fw-bold pe-4">Shuffle Answers</td>
            <td>{boolLabel(quiz.shuffleAnswers)}</td>
          </tr>
          <tr>
            <td className="text-end fw-bold pe-4">Time Limit</td>
            <td>{quiz.timeLimitEnabled ? `${quiz.timeLimit} Minutes` : "No Limit"}</td>
          </tr>
          <tr>
            <td className="text-end fw-bold pe-4">Multiple Attempts</td>
            <td>{boolLabel(quiz.multipleAttempts)}</td>
          </tr>
          {quiz.multipleAttempts && (
            <tr>
              <td className="text-end fw-bold pe-4">How Many Attempts</td>
              <td>{quiz.howManyAttempts}</td>
            </tr>
          )}
          <tr>
            <td className="text-end fw-bold pe-4">Show Correct Answers</td>
            <td>{quiz.showCorrectAnswers}</td>
          </tr>
          <tr>
            <td className="text-end fw-bold pe-4">Access Code</td>
            <td>{quiz.accessCode || <span className="text-muted">None</span>}</td>
          </tr>
          <tr>
            <td className="text-end fw-bold pe-4">One Question at a Time</td>
            <td>{boolLabel(quiz.oneQuestionAtATime)}</td>
          </tr>
          <tr>
            <td className="text-end fw-bold pe-4">Require Respondus LockDown Browser</td>
            <td>No</td>
          </tr>
          <tr>
            <td className="text-end fw-bold pe-4">Webcam Required</td>
            <td>{boolLabel(quiz.webcamRequired)}</td>
          </tr>
          <tr>
            <td className="text-end fw-bold pe-4">Lock Questions After Answering</td>
            <td>{boolLabel(quiz.lockQuestionsAfterAnswering)}</td>
          </tr>
        </tbody>
      </table>

      <table className="table table-bordered mt-3" style={{ maxWidth: 600 }}>
        <thead className="table-secondary">
          <tr>
            <th>Due</th>
            <th>For</th>
            <th>Available from</th>
            <th>Until</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{formatDate(quiz.dueDate)}</td>
            <td>Everyone</td>
            <td>{formatDate(quiz.availableDate)}</td>
            <td>{formatDate(quiz.untilDate)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
