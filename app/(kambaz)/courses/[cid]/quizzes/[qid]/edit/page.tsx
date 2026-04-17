"use client";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { RootState } from "@/app/(kambaz)/store";
import { updateQuiz, Quiz, Question, Choice, defaultQuestion } from "../../reducer";
import * as client from "../../client";

export default function QuizEditor() {
  const { cid, qid } = useParams<{ cid: string | string[]; qid: string | string[] }>();
  const courseId = Array.isArray(cid) ? cid[0] : cid;
  const quizId = Array.isArray(qid) ? qid[0] : qid;
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "questions" ? "questions" : "details";
  const [activeTab, setActiveTab] = useState<"details" | "questions">(initialTab);

  const { quizzes } = useSelector((state: RootState) => state.quizzesReducer);
  const [quiz, setQuiz] = useState<Quiz | null>(
    quizzes.find((q: Quiz) => q._id === quizId) ?? null,
  );
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);

  useEffect(() => {
    if (!quiz) {
      client.findQuizById(quizId).then(setQuiz);
    }
  }, [quizId]);

  if (!quiz) return <div className="p-3">Loading...</div>;

  const totalPoints = quiz.questions.reduce((s, q) => s + (q.points || 0), 0);

  const setField = (field: keyof Quiz, value: any) =>
    setQuiz((prev) => prev ? { ...prev, [field]: value } : prev);

  const saveAndNavigate = async (path: string) => {
    const saved = await client.updateQuiz(quiz);
    dispatch(updateQuiz(saved));
    router.push(path);
  };

  const saveAndPublish = async () => {
    const saved = await client.updateQuiz({ ...quiz, published: true });
    dispatch(updateQuiz(saved));
    router.push(`/courses/${courseId}/quizzes`);
  };

  const handleSave = () => saveAndNavigate(`/courses/${courseId}/quizzes/${quizId}`);
  const handleCancel = () => router.push(`/courses/${courseId}/quizzes`);

  // -- Question helpers --
  const addQuestion = () => {
    const q = defaultQuestion();
    setQuiz((prev) => prev ? { ...prev, questions: [...prev.questions, q] } : prev);
    setEditingQuestionId(q._id);
  };

  const updateQuestion = (updated: Question) => {
    setQuiz((prev) =>
      prev ? { ...prev, questions: prev.questions.map((q) => (q._id === updated._id ? updated : q)) } : prev,
    );
  };

  const removeQuestion = (qId: string) => {
    setQuiz((prev) => prev ? { ...prev, questions: prev.questions.filter((q) => q._id !== qId) } : prev);
    if (editingQuestionId === qId) setEditingQuestionId(null);
  };

  return (
    <div id="wd-quiz-editor" className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <span className="text-muted">
          Points {totalPoints} &nbsp;
          {quiz.published ? "✅ Published" : "🚫 Not Published"}
        </span>
      </div>

      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "details" ? "active" : ""}`}
            onClick={() => setActiveTab("details")}
          >
            Details
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "questions" ? "active" : ""}`}
            onClick={() => setActiveTab("questions")}
          >
            Questions
          </button>
        </li>
      </ul>

      {activeTab === "details" && (
        <DetailsTab quiz={quiz} setField={setField} />
      )}
      {activeTab === "questions" && (
        <QuestionsTab
          quiz={quiz}
          editingQuestionId={editingQuestionId}
          setEditingQuestionId={setEditingQuestionId}
          addQuestion={addQuestion}
          updateQuestion={updateQuestion}
          removeQuestion={removeQuestion}
        />
      )}

      <hr />
      <div className="d-flex justify-content-end gap-2 mt-3">
        <button className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
        <button className="btn btn-outline-danger" onClick={saveAndPublish}>Save & Publish</button>
        <button className="btn btn-danger" onClick={handleSave}>Save</button>
      </div>
    </div>
  );
}

function DetailsTab({ quiz, setField }: { quiz: Quiz; setField: (f: keyof Quiz, v: any) => void }) {
  return (
    <div>
      <div className="mb-3">
        <label className="form-label fw-bold">Title</label>
        <input
          className="form-control"
          value={quiz.title}
          onChange={(e) => setField("title", e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="form-label fw-bold">Quiz Instructions</label>
        <textarea
          className="form-control"
          rows={4}
          value={quiz.description}
          onChange={(e) => setField("description", e.target.value)}
        />
      </div>
      <div className="row mb-3">
        <label className="col-sm-3 col-form-label text-end">Quiz Type</label>
        <div className="col-sm-9">
          <select className="form-select" value={quiz.quizType} onChange={(e) => setField("quizType", e.target.value)}>
            <option value="GRADED_QUIZ">Graded Quiz</option>
            <option value="PRACTICE_QUIZ">Practice Quiz</option>
            <option value="GRADED_SURVEY">Graded Survey</option>
            <option value="UNGRADED_SURVEY">Ungraded Survey</option>
          </select>
        </div>
      </div>
      <div className="row mb-3">
        <label className="col-sm-3 col-form-label text-end">Assignment Group</label>
        <div className="col-sm-9">
          <select className="form-select" value={quiz.assignmentGroup} onChange={(e) => setField("assignmentGroup", e.target.value)}>
            <option value="QUIZZES">Quizzes</option>
            <option value="EXAMS">Exams</option>
            <option value="ASSIGNMENTS">Assignments</option>
            <option value="PROJECT">Project</option>
          </select>
        </div>
      </div>
      <div className="row mb-3">
        <label className="col-sm-3 col-form-label text-end">Options</label>
        <div className="col-sm-9">
          <div className="form-check mb-2">
            <input
              id="shuffleAnswers"
              type="checkbox"
              className="form-check-input"
              checked={quiz.shuffleAnswers}
              onChange={(e) => setField("shuffleAnswers", e.target.checked)}
            />
            <label className="form-check-label" htmlFor="shuffleAnswers">Shuffle Answers</label>
          </div>
          <div className="form-check mb-2 d-flex align-items-center gap-2">
            <input
              id="timeLimitEnabled"
              type="checkbox"
              className="form-check-input"
              checked={quiz.timeLimitEnabled}
              onChange={(e) => setField("timeLimitEnabled", e.target.checked)}
            />
            <label className="form-check-label" htmlFor="timeLimitEnabled">Time Limit</label>
            {quiz.timeLimitEnabled && (
              <input
                type="number"
                className="form-control form-control-sm"
                style={{ width: 80 }}
                value={quiz.timeLimit}
                onChange={(e) => setField("timeLimit", Number(e.target.value))}
              />
            )}
            {quiz.timeLimitEnabled && <span>Minutes</span>}
          </div>
          <div className="form-check mb-2 d-flex align-items-center gap-2">
            <input
              id="multipleAttempts"
              type="checkbox"
              className="form-check-input"
              checked={quiz.multipleAttempts}
              onChange={(e) => setField("multipleAttempts", e.target.checked)}
            />
            <label className="form-check-label" htmlFor="multipleAttempts">Allow Multiple Attempts</label>
            {quiz.multipleAttempts && (
              <>
                <label className="ms-2">How many:</label>
                <input
                  type="number"
                  className="form-control form-control-sm"
                  style={{ width: 70 }}
                  min={1}
                  value={quiz.howManyAttempts}
                  onChange={(e) => setField("howManyAttempts", Number(e.target.value))}
                />
              </>
            )}
          </div>
          <div className="form-check mb-2">
            <input
              id="oneQuestion"
              type="checkbox"
              className="form-check-input"
              checked={quiz.oneQuestionAtATime}
              onChange={(e) => setField("oneQuestionAtATime", e.target.checked)}
            />
            <label className="form-check-label" htmlFor="oneQuestion">One Question at a Time</label>
          </div>
          <div className="form-check mb-2">
            <input
              id="webcam"
              type="checkbox"
              className="form-check-input"
              checked={quiz.webcamRequired}
              onChange={(e) => setField("webcamRequired", e.target.checked)}
            />
            <label className="form-check-label" htmlFor="webcam">Webcam Required</label>
          </div>
          <div className="form-check mb-2">
            <input
              id="lockQuestions"
              type="checkbox"
              className="form-check-input"
              checked={quiz.lockQuestionsAfterAnswering}
              onChange={(e) => setField("lockQuestionsAfterAnswering", e.target.checked)}
            />
            <label className="form-check-label" htmlFor="lockQuestions">Lock Questions After Answering</label>
          </div>
        </div>
      </div>
      <div className="row mb-3">
        <label className="col-sm-3 col-form-label text-end">Show Correct Answers</label>
        <div className="col-sm-9">
          <select className="form-select" value={quiz.showCorrectAnswers} onChange={(e) => setField("showCorrectAnswers", e.target.value)}>
            <option value="immediately">Immediately</option>
            <option value="after_due_date">After Due Date</option>
            <option value="never">Never</option>
          </select>
        </div>
      </div>
      <div className="row mb-3">
        <label className="col-sm-3 col-form-label text-end">Access Code</label>
        <div className="col-sm-9">
          <input
            className="form-control"
            placeholder="Leave blank for no passcode"
            value={quiz.accessCode}
            onChange={(e) => setField("accessCode", e.target.value)}
          />
        </div>
      </div>
      <div className="row mb-3">
        <label className="col-sm-3 col-form-label text-end">Due Date</label>
        <div className="col-sm-9">
          <input
            type="date"
            className="form-control"
            value={quiz.dueDate || ""}
            onChange={(e) => setField("dueDate", e.target.value)}
          />
        </div>
      </div>
      <div className="row mb-3">
        <label className="col-sm-3 col-form-label text-end">Available Date</label>
        <div className="col-sm-9">
          <input
            type="date"
            className="form-control"
            value={quiz.availableDate || ""}
            onChange={(e) => setField("availableDate", e.target.value)}
          />
        </div>
      </div>
      <div className="row mb-3">
        <label className="col-sm-3 col-form-label text-end">Until Date</label>
        <div className="col-sm-9">
          <input
            type="date"
            className="form-control"
            value={quiz.untilDate || ""}
            onChange={(e) => setField("untilDate", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

function QuestionsTab({
  quiz, editingQuestionId, setEditingQuestionId, addQuestion, updateQuestion, removeQuestion,
}: {
  quiz: Quiz;
  editingQuestionId: string | null;
  setEditingQuestionId: (id: string | null) => void;
  addQuestion: () => void;
  updateQuestion: (q: Question) => void;
  removeQuestion: (id: string) => void;
}) {
  return (
    <div>
      {quiz.questions.length === 0 && (
        <div className="text-muted text-center py-3">No questions yet.</div>
      )}
      {quiz.questions.map((q, idx) => (
        <div key={q._id} className="border rounded mb-3 p-3">
          {editingQuestionId === q._id ? (
            <QuestionEditor
              question={q}
              index={idx}
              onSave={(updated) => { updateQuestion(updated); setEditingQuestionId(null); }}
              onCancel={() => setEditingQuestionId(null)}
              onRemove={() => removeQuestion(q._id)}
            />
          ) : (
            <QuestionPreview
              question={q}
              index={idx}
              onEdit={() => setEditingQuestionId(q._id)}
              onRemove={() => removeQuestion(q._id)}
            />
          )}
        </div>
      ))}
      <div className="text-center mt-3">
        <button className="btn btn-outline-secondary" onClick={addQuestion}>
          + New Question
        </button>
      </div>
    </div>
  );
}

function QuestionPreview({ question, index, onEdit, onRemove }: {
  question: Question; index: number; onEdit: () => void; onRemove: () => void;
}) {
  return (
    <div className="d-flex justify-content-between align-items-start">
      <div>
        <div className="fw-bold">Q{index + 1}: {question.title || "(untitled)"}</div>
        <div className="text-muted small">
          {question.type.replace(/_/g, " ")} — {question.points} pt{question.points !== 1 ? "s" : ""}
        </div>
      </div>
      <div className="d-flex gap-2">
        <button className="btn btn-sm btn-outline-secondary" onClick={onEdit}>Edit</button>
        <button className="btn btn-sm btn-outline-danger" onClick={onRemove}>Delete</button>
      </div>
    </div>
  );
}

function QuestionEditor({ question, index, onSave, onCancel, onRemove }: {
  question: Question;
  index: number;
  onSave: (q: Question) => void;
  onCancel: () => void;
  onRemove: () => void;
}) {
  const [q, setQ] = useState<Question>({ ...question });

  const setQField = (field: keyof Question, value: any) =>
    setQ((prev) => ({ ...prev, [field]: value }));

  const changeType = (type: Question["type"]) => {
    setQ((prev) => ({
      ...prev,
      type,
      choices: type === "MULTIPLE_CHOICE" ? (prev.choices?.length ? prev.choices : [{ _id: uuidv4(), text: "" }, { _id: uuidv4(), text: "" }]) : prev.choices,
      correctAnswer: type === "TRUE_FALSE" ? "true" : "",
      possibleAnswers: type === "FILL_IN_BLANK" ? (prev.possibleAnswers?.length ? prev.possibleAnswers : [""]) : prev.possibleAnswers,
    }));
  };

  const addChoice = () =>
    setQ((prev) => ({ ...prev, choices: [...(prev.choices || []), { _id: uuidv4(), text: "" }] }));

  const updateChoice = (id: string, text: string) =>
    setQ((prev) => ({
      ...prev,
      choices: (prev.choices || []).map((c) => (c._id === id ? { ...c, text } : c)),
    }));

  const removeChoice = (id: string) =>
    setQ((prev) => ({ ...prev, choices: (prev.choices || []).filter((c) => c._id !== id) }));

  const addAnswer = () =>
    setQ((prev) => ({ ...prev, possibleAnswers: [...(prev.possibleAnswers || []), ""] }));

  const updateAnswer = (i: number, val: string) =>
    setQ((prev) => {
      const a = [...(prev.possibleAnswers || [])];
      a[i] = val;
      return { ...prev, possibleAnswers: a };
    });

  const removeAnswer = (i: number) =>
    setQ((prev) => ({ ...prev, possibleAnswers: (prev.possibleAnswers || []).filter((_, idx) => idx !== i) }));

  return (
    <div>
      <div className="d-flex gap-2 mb-3 align-items-center">
        <input
          className="form-control"
          style={{ maxWidth: 200 }}
          placeholder={`Question ${index + 1} Title`}
          value={q.title}
          onChange={(e) => setQField("title", e.target.value)}
        />
        <select className="form-select" style={{ maxWidth: 200 }} value={q.type} onChange={(e) => changeType(e.target.value as Question["type"])}>
          <option value="MULTIPLE_CHOICE">Multiple Choice</option>
          <option value="TRUE_FALSE">True/False</option>
          <option value="FILL_IN_BLANK">Fill in the Blank</option>
        </select>
        <label className="ms-auto me-1">pts:</label>
        <input
          type="number"
          className="form-control"
          style={{ width: 70 }}
          min={0}
          value={q.points}
          onChange={(e) => setQField("points", Number(e.target.value))}
        />
      </div>

      <div className="mb-3">
        <label className="form-label fw-bold">Question:</label>
        <textarea
          className="form-control"
          rows={3}
          value={q.question}
          onChange={(e) => setQField("question", e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label className="form-label fw-bold">Answers:</label>
        {q.type === "MULTIPLE_CHOICE" && (
          <div>
            {(q.choices || []).map((c: Choice) => (
              <div key={c._id} className="d-flex align-items-center gap-2 mb-2">
                <input
                  type="radio"
                  name={`correct-${q._id}`}
                  checked={q.correctAnswer === c._id}
                  onChange={() => setQField("correctAnswer", c._id)}
                  title="Mark as correct answer"
                />
                <input
                  className="form-control"
                  placeholder="Possible Answer"
                  value={c.text}
                  onChange={(e) => updateChoice(c._id, e.target.value)}
                />
                <button className="btn btn-sm btn-outline-danger" onClick={() => removeChoice(c._id)}>✕</button>
              </div>
            ))}
            <button className="btn btn-sm btn-outline-secondary" onClick={addChoice}>+ Add Another Answer</button>
          </div>
        )}
        {q.type === "TRUE_FALSE" && (
          <div>
            <div className="form-check">
              <input
                type="radio"
                className="form-check-input"
                id={`tf-true-${q._id}`}
                checked={q.correctAnswer === "true"}
                onChange={() => setQField("correctAnswer", "true")}
              />
              <label className="form-check-label" htmlFor={`tf-true-${q._id}`}>True</label>
            </div>
            <div className="form-check">
              <input
                type="radio"
                className="form-check-input"
                id={`tf-false-${q._id}`}
                checked={q.correctAnswer === "false"}
                onChange={() => setQField("correctAnswer", "false")}
              />
              <label className="form-check-label" htmlFor={`tf-false-${q._id}`}>False</label>
            </div>
          </div>
        )}
        {q.type === "FILL_IN_BLANK" && (
          <div>
            {(q.possibleAnswers || []).map((ans, i) => (
              <div key={i} className="d-flex gap-2 mb-2">
                <input
                  className="form-control"
                  placeholder="Possible Answer"
                  value={ans}
                  onChange={(e) => updateAnswer(i, e.target.value)}
                />
                <button className="btn btn-sm btn-outline-danger" onClick={() => removeAnswer(i)}>✕</button>
              </div>
            ))}
            <button className="btn btn-sm btn-outline-secondary" onClick={addAnswer}>+ Add Another Answer</button>
          </div>
        )}
      </div>

      <div className="d-flex gap-2 justify-content-between">
        <button className="btn btn-sm btn-outline-danger" onClick={onRemove}>Delete Question</button>
        <div className="d-flex gap-2">
          <button className="btn btn-sm btn-secondary" onClick={onCancel}>Cancel</button>
          <button className="btn btn-sm btn-danger" onClick={() => onSave(q)}>Update Question</button>
        </div>
      </div>
    </div>
  );
}
