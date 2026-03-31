"use client";
import { useParams, useRouter } from "next/navigation";
import { ChangeEvent, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/(kambaz)/store";
import { addAssignment, deleteAssignment, updateAssignment } from "../reducer";
import * as client from "../client";

interface Assignment {
  _id: string;
  title: string;
  course: string;
  description?: string;
  points?: number;
  dueDate?: string;
  availableDate?: string;
  availableUntil?: string;
}

interface AssignmentFormData {
  title: string;
  description: string;
  points: number;
  dueDate: string;
  availableDate: string;
  availableUntil: string;
}

const defaultFormData: AssignmentFormData = {
  title: "",
  description: "",
  points: 100,
  dueDate: "",
  availableDate: "",
  availableUntil: "",
};

export default function AssignmentEditor() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { cid, aid } = useParams<{
    cid: string | string[];
    aid: string | string[];
  }>();
  const courseId = Array.isArray(cid) ? cid[0] : cid;
  const assignmentId = Array.isArray(aid) ? aid[0] : aid;
  const isNewAssignment = assignmentId === "new";

  const { assignments } = useSelector(
    (state: RootState) => state.assignmentsReducer,
  );
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer,
  );
  const isFaculty =
    (currentUser as { role?: string } | null)?.role === "FACULTY";

  const assignment = useMemo(
    () =>
      assignments.find(
        (a: Assignment) => a._id === assignmentId && a.course === courseId,
      ),
    [assignments, assignmentId, courseId],
  );

  const [formData, setFormData] = useState<AssignmentFormData>(() => {
    if (isNewAssignment || !assignment) {
      return defaultFormData;
    }

    return {
      title: assignment.title || "",
      description: assignment.description || "",
      points: assignment.points || 100,
      dueDate: assignment.dueDate || "",
      availableDate: assignment.availableDate || "",
      availableUntil: assignment.availableUntil || "",
    };
  });

  const navigateToAssignments = () => {
    router.push(`/courses/${courseId}/assignments`);
  };

  const updateField =
    (field: keyof AssignmentFormData) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value =
        field === "points" ? Number(e.target.value || 0) : e.target.value;
      setFormData((prev) => ({ ...prev, [field]: value }));
    };

  const saveAssignment = async () => {
    if (!isFaculty) {
      navigateToAssignments();
      return;
    }

    if (isNewAssignment) {
      const newAssignment = await client.createAssignmentForCourse(courseId, {
        ...formData,
        course: courseId,
      });
      dispatch(addAssignment(newAssignment));
      navigateToAssignments();
      return;
    }

    if (assignment) {
      const updatedAssignment = {
        ...assignment,
        ...formData,
        course: courseId,
      };
      await client.updateAssignment(updatedAssignment);
      dispatch(updateAssignment(updatedAssignment));
      navigateToAssignments();
    }
  };

  const removeAssignment = async () => {
    if (!isFaculty || isNewAssignment || !assignment) {
      navigateToAssignments();
      return;
    }

    await client.deleteAssignment(assignment._id);
    dispatch(deleteAssignment(assignment._id));
    navigateToAssignments();
  };

  if (!isNewAssignment && !assignment) {
    return (
      <div id="wd-assignments-editor">
        <p>Assignment not found</p>
        <button className="btn btn-secondary" onClick={navigateToAssignments}>
          Back to Assignments
        </button>
      </div>
    );
  }

  return (
    <div id="wd-assignments-editor">
      <div className="mb-3">
        <label htmlFor="wd-name" className="form-label">
          Assignment Name
        </label>
        <input
          id="wd-name"
          className="form-control"
          value={formData.title}
          onChange={updateField("title")}
          disabled={!isFaculty}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="wd-description" className="form-label">
          Description
        </label>
        <textarea
          id="wd-description"
          className="form-control"
          rows={5}
          value={formData.description}
          onChange={updateField("description")}
          disabled={!isFaculty}
        ></textarea>
      </div>

      <div className="row mb-3">
        <label htmlFor="wd-points" className="col-sm-3 col-form-label text-end">
          Points
        </label>
        <div className="col-sm-9">
          <input
            id="wd-points"
            className="form-control"
            value={formData.points}
            onChange={updateField("points")}
            type="number"
            disabled={!isFaculty}
          />
        </div>
      </div>

      <div className="row mb-3">
        <label
          htmlFor="assignment-groups"
          className="col-sm-3 col-form-label text-end"
        >
          Assignment Group
        </label>
        <div className="col-sm-9">
          <select
            id="assignment-groups"
            className="form-select"
            disabled={!isFaculty}
          >
            <option>Assignments</option>
            <option>Quizzes</option>
          </select>
        </div>
      </div>

      <div className="row mb-3">
        <label
          htmlFor="display-grade"
          className="col-sm-3 col-form-label text-end"
        >
          Display Grade as
        </label>
        <div className="col-sm-9">
          <select
            id="display-grade"
            className="form-select"
            disabled={!isFaculty}
          >
            <option>Percentage</option>
            <option>Letter Grade</option>
          </select>
        </div>
      </div>

      <div className="row mb-3">
        <label
          htmlFor="submission-type"
          className="col-sm-3 col-form-label text-end"
        >
          Submission Type
        </label>
        <div className="col-sm-9">
          <div className="border rounded p-3">
            <select
              id="submission-type"
              className="form-select mb-3"
              disabled={!isFaculty}
            >
              <option>Online</option>
              <option>In Person</option>
            </select>

            <div>
              <label className="form-label fw-bold">Online Entry Options</label>
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="text-entry"
                  disabled={!isFaculty}
                />
                <label className="form-check-label" htmlFor="text-entry">
                  Text Entry
                </label>
              </div>
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="website-url"
                  disabled={!isFaculty}
                />
                <label className="form-check-label" htmlFor="website-url">
                  Website URL
                </label>
              </div>
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="media-recordings"
                  disabled={!isFaculty}
                />
                <label className="form-check-label" htmlFor="media-recordings">
                  Media Recordings
                </label>
              </div>
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="student-annotation"
                  disabled={!isFaculty}
                />
                <label
                  className="form-check-label"
                  htmlFor="student-annotation"
                >
                  Student Annotation
                </label>
              </div>
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="file-uploads"
                  disabled={!isFaculty}
                />
                <label className="form-check-label" htmlFor="file-uploads">
                  File Uploads
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-3">
        <label className="col-sm-3 col-form-label text-end">Assign</label>
        <div className="col-sm-9">
          <div className="border rounded p-3">
            <div className="mb-3">
              <label htmlFor="assign" className="form-label">
                Assign To
              </label>
              <select id="assign" className="form-select" disabled={!isFaculty}>
                <option>Everyone</option>
                <option>Students</option>
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="due" className="form-label">
                Due
              </label>
              <input
                type="date"
                id="due"
                className="form-control"
                value={formData.dueDate}
                onChange={updateField("dueDate")}
                disabled={!isFaculty}
              />
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="available-from" className="form-label">
                  Available From
                </label>
                <input
                  type="date"
                  id="available-from"
                  className="form-control"
                  value={formData.availableDate}
                  onChange={updateField("availableDate")}
                  disabled={!isFaculty}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="until" className="form-label">
                  Until
                </label>
                <input
                  type="date"
                  id="until"
                  className="form-control"
                  value={formData.availableUntil}
                  onChange={updateField("availableUntil")}
                  disabled={!isFaculty}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-sm-3"></div>
        <div className="col-sm-9 text-end">
          <button
            id="wd-cancel-assignment"
            className="btn btn-secondary me-2"
            onClick={navigateToAssignments}
          >
            {isFaculty ? "Cancel" : "Back"}
          </button>
          {isFaculty && !isNewAssignment && (
            <button
              id="wd-delete-assignment"
              className="btn btn-outline-danger me-2"
              onClick={removeAssignment}
            >
              Delete
            </button>
          )}
          {isFaculty && (
            <button
              id="wd-save-assignment"
              className="btn btn-danger"
              onClick={saveAssignment}
            >
              Save
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
