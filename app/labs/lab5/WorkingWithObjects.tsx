import React, { useState } from "react";
import { FormControl } from "react-bootstrap";
const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
export default function WorkingWithObjects() {
    const [assignment, setAssignment] = useState({
    id: 1, title: "NodeJS Assignment",
    description: "Create a NodeJS server with ExpressJS",
    due: "2021-10-10", completed: false, score: 0,
  });
  const [module, setModule] = useState({
    id: "M101",
    name: "Intro to Node",
    description: "Build simple HTTP routes with Express",
    course: "CS4550",
  });
  const ASSIGNMENT_API_URL = `${HTTP_SERVER}/lab5/assignment`
  const MODULE_API_URL = `${HTTP_SERVER}/lab5/module`
  return (
    <div id="wd-working-with-objects">
      <h3>Working With Objects</h3>
            <h4>Modifying Properties</h4>
      <a id="wd-update-assignment-title"
         className="btn btn-primary mb-2"
         href={`${ASSIGNMENT_API_URL}/title/${assignment.title}`}>
        Update Title </a>
      <FormControl className="w-75" id="wd-assignment-title"
        defaultValue={assignment.title} onChange={(e) =>
          setAssignment({ ...assignment, title: e.target.value })}/>
      <hr />
      <h4>Retrieving Objects</h4>
      <a id="wd-retrieve-assignments" className="btn btn-primary"
         href={`${HTTP_SERVER}/lab5/assignment`}>
        Get Assignment
      </a><hr/>
      <h4>Retrieving Properties</h4>
      <a id="wd-retrieve-assignment-title" className="btn btn-primary"
         href={`${HTTP_SERVER}/lab5/assignment/title`}>
        Get Title
      </a><hr/>

      <h4>Retrieving Module Object</h4>
      <a id="wd-retrieve-module" className="btn btn-primary"
         href={MODULE_API_URL}>
        Get Module
      </a><hr/>

      <h4>Retrieving Module Name</h4>
      <a id="wd-retrieve-module-name" className="btn btn-primary"
         href={`${MODULE_API_URL}/name`}>
        Get Module Name
      </a><hr/>

      <h4>Updating Module Name</h4>
      <a id="wd-update-module-name" className="btn btn-primary mb-2"
         href={`${MODULE_API_URL}/name/${encodeURIComponent(module.name)}`}>
        Update Module Name
      </a>
      <FormControl className="w-75" id="wd-module-name"
        defaultValue={module.name} onChange={(e) =>
          setModule({ ...module, name: e.target.value })}/>
      <hr />

      <h4>Updating Module Description</h4>
      <a id="wd-update-module-description" className="btn btn-primary mb-2"
         href={`${MODULE_API_URL}/description/${encodeURIComponent(module.description)}`}>
        Update Module Description
      </a>
      <FormControl className="w-75" id="wd-module-description"
        defaultValue={module.description} onChange={(e) =>
          setModule({ ...module, description: e.target.value })}/>
      <hr />

      <h4>Updating Assignment Score</h4>
      <a id="wd-update-assignment-score" className="btn btn-primary mb-2"
         href={`${ASSIGNMENT_API_URL}/score/${assignment.score}`}>
        Update Score
      </a>
      <FormControl type="number" className="w-75" id="wd-assignment-score"
        defaultValue={assignment.score} onChange={(e) =>
          setAssignment({ ...assignment, score: Number(e.target.value) })}/>
      <hr />

      <h4>Updating Assignment Completed</h4>
      <a id="wd-update-assignment-completed" className="btn btn-primary mb-2"
         href={`${ASSIGNMENT_API_URL}/completed/${assignment.completed}`}>
        Update Completed
      </a>
      <div className="pt-2">
        <input type="checkbox" id="wd-assignment-completed"
          checked={assignment.completed}
          onChange={(e) => setAssignment({ ...assignment, completed: e.target.checked })} />
        <label htmlFor="wd-assignment-completed" className="ms-2">
          Completed
        </label>
      </div>
      <hr />
    </div>
);}
