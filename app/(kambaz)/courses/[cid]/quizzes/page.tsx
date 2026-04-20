"use client";
// Quiz List screen — shows all quizzes for a course, handles add/delete/publish and search
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BsGripVertical, BsPlus, BsThreeDotsVertical } from "react-icons/bs";
import { CiSearch } from "react-icons/ci";
import { FaRegCheckCircle } from "react-icons/fa";
import { MdOutlineDoNotDisturb } from "react-icons/md";
import { RiFileList3Line } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/(kambaz)/store";
import { deleteQuiz, setQuizzes, updateQuiz, addQuiz, defaultQuiz, Quiz } from "./reducer";
import * as client from "./client";

function formatAvailDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
  });
}

function getAvailabilityLabel(quiz: Quiz): string {
  const now = new Date();
  if (quiz.untilDate && new Date(quiz.untilDate) < now) return "Closed";
  if (quiz.availableDate && new Date(quiz.availableDate) > now) {
    return `Not available until ${formatAvailDate(quiz.availableDate)}`;
  }
  return "Available";
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "No due date";
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

export default function Quizzes() {
  const { cid } = useParams<{ cid: string | string[] }>();
  const courseId = Array.isArray(cid) ? cid[0] : cid; // unwrap Next.js array param
  const dispatch = useDispatch();
  const router = useRouter();
  const { quizzes } = useSelector((state: RootState) => state.quizzesReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const isFaculty = (currentUser as any)?.role === "FACULTY"; // hides add/edit/delete for students
  const [search, setSearch] = useState("");
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  // filter to this course, match search, then sort by availableDate ascending
  const courseQuizzes = quizzes.filter((q: Quiz) => q.course === courseId);
  const filtered = courseQuizzes
    .filter((q: Quiz) => q.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a: Quiz, b: Quiz) => {
      const aDate = a.availableDate ? new Date(a.availableDate).getTime() : Infinity;
      const bDate = b.availableDate ? new Date(b.availableDate).getTime() : Infinity;
      return aDate - bDate;
    });

  // fetch quizzes for this course on mount; students only get published ones (server filters)
  useEffect(() => {
    client
      .findQuizzesForCourse(courseId)
      .then((data) => dispatch(setQuizzes(data)))
      .catch(console.error);
  }, [courseId]);

  // creates quiz with defaults, dispatches to Redux, navigates to editor
  const handleAddQuiz = async () => {
    if (adding) return;
    setAdding(true);
    try {
      const newQuiz = await client.createQuiz(courseId, defaultQuiz(courseId));
      dispatch(addQuiz(newQuiz));
      router.push(`/courses/${courseId}/quizzes/${newQuiz._id}/edit`);
    } catch (err: any) {
      alert(err?.response?.data?.error || "Failed to create quiz. Are you logged in as faculty?");
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (quizId: string) => {
    if (!window.confirm("Delete this quiz?")) return;
    await client.deleteQuiz(quizId).catch(console.error);
    dispatch(deleteQuiz(quizId));
  };

  // flips published flag — students immediately gain/lose access
  const handleTogglePublish = async (quiz: Quiz) => {
    const updated = { ...quiz, published: !quiz.published };
    const saved = await client.updateQuiz(updated);
    dispatch(updateQuiz(saved));
  };

  return (
    <div id="wd-quizzes">
      <div className="d-flex align-items-center mb-3 gap-2">
        <div className="position-relative flex-grow-1" style={{ maxWidth: 320 }}>
          <CiSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary" />
          <input
            className="form-control ps-5"
            placeholder="Search for Quiz"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {isFaculty && (
          <button
            id="wd-add-quiz"
            className="btn btn-danger ms-auto"
            onClick={handleAddQuiz}
            disabled={adding}
          >
            <BsPlus className="fs-5" /> {adding ? "Creating..." : "Quiz"}
          </button>
        )}
      </div>

      <div className="wd-title p-3 ps-2 bg-secondary mt-3 d-flex align-items-center">
        <BsGripVertical className="me-2 fs-3" />
        <span className="fs-5 fw-bold">Assignment Quizzes</span>
      </div>

      {filtered.length === 0 && (
        <div className="text-center text-muted py-5">
          No quizzes yet. {isFaculty && "Click + Quiz to add one."}
        </div>
      )}

      <ul className="list-unstyled m-0">
        {filtered.map((quiz: Quiz) => {
          const totalPoints = (quiz.questions || []).reduce((s, q) => s + (q.points || 0), 0);
          const availability = getAvailabilityLabel(quiz);
          return (
            <li
              key={quiz._id}
              className="border-start border-success border-4 d-flex align-items-center p-3 border-bottom"
            >
              <BsGripVertical className="me-2 fs-4 text-secondary flex-shrink-0" />
              <RiFileList3Line className="me-3 fs-4 text-secondary flex-shrink-0" />
              <div className="flex-grow-1">
                <Link
                  href={`/courses/${courseId}/quizzes/${quiz._id}`}
                  className="fw-bold text-dark text-decoration-none"
                >
                  {quiz.title}
                </Link>
                <div className="text-secondary small mt-1">
                  <span
                    className={availability === "Available" ? "text-success" : availability === "Closed" ? "text-danger" : ""}
                  >
                    {availability}
                  </span>
                  {" | "}
                  <b>Due</b> {formatDate(quiz.dueDate)}
                  {" | "}
                  {totalPoints} pts
                  {" | "}
                  {(quiz.questions || []).length} Questions
                  {!isFaculty && quiz.lastScore != null && (
                    <span> | Score: {quiz.lastScore}/{quiz.lastMaxScore}</span>
                  )}
                </div>
              </div>
              <div className="d-flex align-items-center gap-2 ms-2 flex-shrink-0">
                <button
                  className="btn btn-sm btn-link p-0 text-decoration-none"
                  title={quiz.published ? "Published" : "Unpublished"}
                  onClick={() => isFaculty && handleTogglePublish(quiz)}
                >
                  {quiz.published ? (
                    <FaRegCheckCircle className="text-success fs-5" />
                  ) : (
                    <MdOutlineDoNotDisturb className="text-danger fs-5" />
                  )}
                </button>
                {isFaculty && (
                  <div className="position-relative">
                    <button
                      className="btn btn-sm btn-link p-0 text-dark"
                      onClick={() => setOpenMenu(openMenu === quiz._id ? null : quiz._id)}
                    >
                      <BsThreeDotsVertical />
                    </button>
                    {openMenu === quiz._id && (
                      <ul
                        className="dropdown-menu show position-absolute end-0"
                        style={{ zIndex: 1000, minWidth: 140 }}
                      >
                        <li>
                          <Link
                            className="dropdown-item"
                            href={`/courses/${courseId}/quizzes/${quiz._id}/edit`}
                            onClick={() => setOpenMenu(null)}
                          >
                            Edit
                          </Link>
                        </li>
                        <li>
                          <button
                            className="dropdown-item text-danger"
                            onClick={() => { setOpenMenu(null); handleDelete(quiz._id); }}
                          >
                            Delete
                          </button>
                        </li>
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => { setOpenMenu(null); handleTogglePublish(quiz); }}
                          >
                            {quiz.published ? "Unpublish" : "Publish"}
                          </button>
                        </li>
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
