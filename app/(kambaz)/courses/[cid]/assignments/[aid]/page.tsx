export default function AssignmentEditor() {
  return (
    <div id="wd-assignments-editor">
      <label htmlFor="wd-name">Assignment Name</label>
      <br />
      <br />
      <input id="wd-name" defaultValue="A1 - ENV + HTML" /><br /><br />
      <textarea id="wd-description" cols={50}>
        The assignment is available online Submit a link to the landing page of
      </textarea>
      <br />
      <br />
      <table>
        <tr>
          <td align="right" valign="top">
            <label htmlFor="wd-points">Points</label>
          </td>
          <td>
            <input id="wd-points" defaultValue={100} />
          </td>
        </tr>
        <br />
        <tr>
            <td align="right" valign="top">
                <label htmlFor="assignment-groups">Assignment Group</label>
            </td>
            <td>
                <select id="assignment-groups">
                    <option>Assignments</option>
                    <option>Quizzes</option>
                </select>
            </td>
        </tr>
        <br />
        <tr>
            <td align="right" valign="top">
                <label htmlFor="display-grade">Display Grade as</label>
            </td>
            <td>
                <select id="display-grade">
                    <option>Percentage</option>
                    <option>Letter Grade</option>
                </select>
            </td>
        </tr>
        <br />
        <tr>
            <td align="right" valign="top">
                <label htmlFor="submission-type">Submission Type</label>
            </td>
            <td>
                <div>
                    <div>
                        <select id="submission-type">
                            <option>Online</option>
                            <option>In Person</option>
                        </select>
                    </div>
                    <br />
                    <div>
                        <label htmlFor="online-entry-options">Online Entry Options</label>
                        <div>
                            <div>
                                <input type="checkbox" id="text-entry" />
                                <label htmlFor="text-entry">Text Entry</label>
                            </div>
                            <div>
                                <input type="checkbox" id="website-url" />
                                <label htmlFor="website-url">Website URL</label>
                            </div>
                            <div>
                                <input type="checkbox" id="media-recordings" />
                                <label htmlFor="media-recordings">Media Recordings</label>
                            </div>
                            <div>
                                <input type="checkbox" id="student-annotation" />
                                <label htmlFor="student-annotation">Student Annotation</label>
                            </div>
                            <div>
                                <input type="checkbox" id="file-uploads" />
                                <label htmlFor="file-uploads">File Uploads</label>
                            </div>
                        </div>
                    </div>
                </div>
            </td>
        </tr>
        <br />
        <tr>
            <td align="right" valign="top">
                <label htmlFor="assign">Assign </label>
                <label htmlFor="assign">Assign To</label>
            </td>
            <td>
                <select id="assign">
                    <option>Everyone</option>
                    <option>Students</option>
                </select>
            </td>
        </tr>
        <br />
        <tr>
            <td align="right" valign="top">
                <label htmlFor="due">Due</label>
            </td>
            <td>
                <input type="date" id="due" />
            </td>
        </tr>
        <br />
        <tr>
            <td align="left" valign="top">
            </td>
            <td align="left" valign="top">
                <div>
                    <label htmlFor="available-from">Available From</label>
                    <br />
                    <input type="date" id="available-from" />
                </div>
            </td>
            <td align="left" valign="top">
                <div>
                    <label htmlFor="until">Until</label>
                    <br />
                    <input type="date" id="until" />
                </div>
            </td>
        </tr>
        <br />
        <tr>
            <td colSpan={50} align="right" valign="top">
                <button id="wd-cancel-assignment">Cancel</button>
                <button id="wd-save-assignment">Save</button>
            </td>
        </tr>
      </table>
      <hr></hr>
    </div>
);}
