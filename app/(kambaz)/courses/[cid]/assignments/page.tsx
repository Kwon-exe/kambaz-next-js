"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { BsGripVertical } from "react-icons/bs";
import { BsPlus } from "react-icons/bs";
import AssignmentControlButtons from "./assignmentControlButtons";
import { CiSearch } from "react-icons/ci";
import { DropdownToggle } from "react-bootstrap";
import { LuNotebookPen } from "react-icons/lu";
import SingleAssignmentControlButton from "./singleAssignmentControlButton";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/(kambaz)/store";
import { deleteAssignment } from "./reducer";

interface Assignment {
  _id: string;
  title: string;
  course: string;
  availableDate?: string;
  dueDate?: string;
  points?: number;
  modules?: string;
}

function formatDate(dateString: string): string {
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return `${months[date.getMonth()]} ${date.getDate()}`;
}

export default function Assignments() {
  const { cid } = useParams<{ cid: string | string[] }>();
  const courseId = Array.isArray(cid) ? cid[0] : cid;
  const dispatch = useDispatch();
  const { assignments } = useSelector(
    (state: RootState) => state.assignmentsReducer,
  );
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer,
  );
  const isFaculty =
    (currentUser as { role?: string } | null)?.role === "FACULTY";
  const courseAssignments = assignments.filter(
    (assignment: Assignment) => assignment.course === courseId,
  );

  const confirmAndDeleteAssignment = (assignmentId: string) => {
    const shouldDelete = window.confirm(
      "Are you sure you want to remove this assignment?",
    );
    if (!shouldDelete) return;
    dispatch(deleteAssignment(assignmentId));
  };

  return (
    <div id="wd-assignments" className="font-size-1.5rem">
      <div className="position-relative d-inline-block">
        <CiSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary" />
        <input
          id="wd-search-assignment"
          className="form-control ps-5 pe-5"
          placeholder="Search..."
        />
      </div>{" "}
      {isFaculty && (
        <Link
          id="wd-add-assignment"
          href={`/courses/${courseId}/assignments/new`}
          className="float-end bg-danger text-white border-0 me-1 rounded-1 px-2 py-1 text-decoration-none"
        >
          <BsPlus /> Assignment
        </Link>
      )}
      {isFaculty && (
        <button
          id="wd-add-assignment-group"
          className="float-end border-0 me-1 rounded-1 bg-secondary"
        >
          <BsPlus /> Group
        </button>
      )}
      <div
        id="wd-assignments-title"
        className="wd-title p-3 ps-2 bg-secondary font-size-2rem mt-3"
      >
        <BsGripVertical className="me-2 fs-3 font-size-2rem" />
        <DropdownToggle variant="secondary" size="lg" id="wd-publish-all-btn" />
        <span className="fs-4">ASSIGNMENTS</span>{" "}
        {isFaculty && <AssignmentControlButtons />}
      </div>
      <ul id="wd-assignment-list" className="list-unstyled m-0">
        {courseAssignments.map((assignment: Assignment) => (
          <div
            key={assignment._id}
            className="border-start border-success border-4 p-3"
          >
            <div className="wd-assignment-list-item font-size-1.25rem">
              <div className="d-flex align-items-center">
                <div className="me-2 d-flex align-items-center">
                  <BsGripVertical className="me-2 fs-3" />
                  <LuNotebookPen className="fs-3 text-success" />
                </div>
                <div className="flex-grow-1 pe-3">
                  <Link
                    href={`/courses/${courseId}/assignments/${assignment._id}`}
                    className="wd-assignment-link text-dark d-block fw-bold text-decoration-none"
                  >
                    {assignment.title}
                  </Link>
                  <div className="font-size-1rem text-secondary">
                    <span className="text-danger">
                      {assignment.modules || "Multiple Modules"}
                    </span>{" "}
                    | <b>Not available</b> until{" "}
                    {assignment.availableDate
                      ? formatDate(assignment.availableDate)
                      : "May 6"}{" "}
                    |
                  </div>
                  <div className="font-size-1rem text-secondary">
                    <b>Due</b>{" "}
                    {assignment.dueDate
                      ? formatDate(assignment.dueDate)
                      : "May 13"}{" "}
                    | {assignment.points || 100} Points
                  </div>
                </div>
                <div>
                  <SingleAssignmentControlButton
                    onDelete={
                      isFaculty
                        ? () => confirmAndDeleteAssignment(assignment._id)
                        : undefined
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </ul>
    </div>
  );
}
