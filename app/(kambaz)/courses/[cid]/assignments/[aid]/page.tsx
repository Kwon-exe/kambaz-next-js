export default function AssignmentEditor() {
  return (
    <div id="wd-assignments-editor">
      <div className="mb-3">
        <label htmlFor="wd-name" className="form-label">
          Assignment Name
        </label>
        <input
          id="wd-name"
          className="form-control"
          defaultValue="A1 - ENV + HTML"
        />
      </div>

      <div className="mb-3">
        <label htmlFor="wd-description" className="form-label">
          Description
        </label>
        <textarea id="wd-description" className="form-control" rows={5}>
          The assignment is available online Submit a link to the landing page
          of
        </textarea>
      </div>

      <div className="row mb-3">
        <label htmlFor="wd-points" className="col-sm-3 col-form-label text-end">
          Points
        </label>
        <div className="col-sm-9">
          <input
            id="wd-points"
            className="form-control"
            defaultValue={100}
            type="number"
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
          <select id="assignment-groups" className="form-select">
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
          <select id="display-grade" className="form-select">
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
            <select id="submission-type" className="form-select mb-3">
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
              <select id="assign" className="form-select">
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
                defaultValue="2026-01-01"
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
                  defaultValue="2026-01-01"
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
                  defaultValue="2026-01-01"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-sm-3"></div>
        <div className="col-sm-9 text-end">
          <button id="wd-cancel-assignment" className="btn btn-secondary me-2">
            Cancel
          </button>
          <button id="wd-save-assignment" className="btn btn-danger">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
