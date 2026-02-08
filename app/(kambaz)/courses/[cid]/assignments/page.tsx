import Link from "next/link";
import { BsGripVertical } from "react-icons/bs";
import { BsPlus } from "react-icons/bs";
import AssignmentControlButtons from "./assignmentControlButtons";
import { CiSearch } from "react-icons/ci";
import { DropdownToggle } from "react-bootstrap";
import { LuNotebookPen } from "react-icons/lu";
import SingleAssignmentControlButton from "./singleAssignmentControlButton";

export default function Assignments() {
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
      <button
        id="wd-add-assignment"
        className="float-end bg-danger text-white border-0 me-1 rounded-1"
      >
        <BsPlus /> Assignment
      </button>
      <button
        id="wd-add-assignment-group"
        className="float-end border-0 me-1 rounded-1 bg-secondary"
      >
        <BsPlus /> Group
      </button>
      <div
        id="wd-assignments-title"
        className="wd-title p-3 ps-2 bg-secondary font-size-2rem mt-3"
      >
        <BsGripVertical className="me-2 fs-3 font-size-2rem" />
        <DropdownToggle variant="secondary" size="lg" id="wd-publish-all-btn" />
        <span className="fs-4">ASSIGNMENTS</span> <AssignmentControlButtons />
      </div>
      <ul id="wd-assignment-list" className="list-unstyled m-0">
        <div className="border-start border-success border-4 p-3">
          <div className="wd-assignment-list-item font-size-1.25rem">
            <div className="d-flex align-items-center">
              <div className="me-2 d-flex align-items-center">
                <BsGripVertical className="me-2 fs-3" />
                <LuNotebookPen className="fs-3 text-success" />
              </div>
              <div className="flex-grow-1 pe-3">
                <Link
                  href="/courses/1234/assignments/123"
                  className="wd-assignment-link text-dark d-block fw-bold text-decoration-none"
                >
                  A1 - ENV + HTML
                </Link>
                <div className="font-size-1rem text-secondary">
                  <span className="text-danger">Multiple Modules</span> |{" "}
                  <b>Not available</b> until May 6 at 12:00 AM |
                </div>
                <div className="font-size-1rem text-secondary">
                  <b>Due</b> May 6 at 11:59 PM | 10 Points
                </div>
              </div>
              <div>
                <SingleAssignmentControlButton />
              </div>
            </div>
          </div>
        </div>
        <div className="border-start border-success border-4 p-3">
          <div className="wd-assignment-list-item font-size-1.25rem">
            <div className="d-flex align-items-center">
              <div className="me-2 d-flex align-items-center">
                <BsGripVertical className="me-2 fs-3" />
                <LuNotebookPen className="fs-3 text-success" />
              </div>
              <div className="flex-grow-1 pe-3">
                <Link
                  href="/courses/1234/assignments/124"
                  className="wd-assignment-link text-dark d-block fw-bold text-decoration-none"
                >
                  A2 - HTML
                </Link>
                <div className="font-size-1rem text-secondary">
                  <span className="text-danger">Multiple Modules</span> |{" "}
                  <b>Not available</b> until May 13 at 12:00 AM |
                </div>
                <div className="font-size-1rem text-secondary">
                  <b>Due</b> May 13 at 11:59 PM | 10 Points
                </div>
              </div>
              <div>
                <SingleAssignmentControlButton />
              </div>
            </div>
          </div>
        </div>
        <div className="border-start border-success border-4 p-3">
          <div className="wd-assignment-list-item font-size-1.25rem">
            <div className="d-flex align-items-center">
              <div className="me-2 d-flex align-items-center">
                <BsGripVertical className="me-2 fs-3" />
                <LuNotebookPen className="fs-3 text-success" />
              </div>
              <div className="flex-grow-1 pe-3">
                <Link
                  href="/courses/1234/assignments/125"
                  className="wd-assignment-link text-dark d-block fw-bold text-decoration-none"
                >
                  A3 - CSS
                </Link>
                <div className="font-size-1rem text-secondary">
                  <span className="text-danger">Multiple Modules</span> |{" "}
                  <b>Not available</b> until May 20 at 12:00 AM |
                </div>
                <div className="font-size-1rem text-secondary">
                  <b>Due</b> May 20 at 11:59 PM | 10 Points
                </div>
              </div>
              <div>
                <SingleAssignmentControlButton />
              </div>
            </div>
          </div>
        </div>
      </ul>
    </div>
  );
}
