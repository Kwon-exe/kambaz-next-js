import React, { useState } from "react";
import { FormControl } from "react-bootstrap";
const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
export default function WorkingWithArrays() {
  const [todo, setTodo] = useState({
    id: "1",
    title: "NodeJS Assignment",
    description: "Create a NodeJS server with ExpressJS",
    due: "2021-09-09",
    completed: false,
  });

  const API = `${HTTP_SERVER}/lab5/todos`;
  return (
    <div id="wd-working-with-arrays">
      <h3>Working with Arrays</h3>
      <h4>Retrieving Arrays</h4>
      <a id="wd-retrieve-todos" className="btn btn-primary" href={API}>
        Get Todos{" "}
      </a>
      <hr />
      <h4>Retrieving an Item from an Array by ID</h4>
      <div className="mb-2">
        <FormControl
          id="wd-retrieve-todo-id"
          defaultValue={todo.id}
          className="w-25 mb-2"
          onChange={(e) => setTodo({ ...todo, id: e.target.value })}
          placeholder="Enter Todo ID"
        />
        <a
          id="wd-retrieve-todo-by-id"
          className="btn btn-primary"
          href={`${API}/${todo.id}`}
        >
          Get Todo by ID
        </a>
      </div>
      <hr />

      <h4>Filtering Array Items</h4>
      <a
        id="wd-retrieve-completed-todos"
        className="btn btn-primary"
        href={`${API}?completed=true`}
      >
        Get Completed Todos
      </a>
      <hr />

      <h4>Creating new Items in an Array</h4>
      <a id="wd-create-todo" className="btn btn-primary" href={`${API}/create`}>
        Create Todo
      </a>
      <hr />

      <h4>Removing from an Array</h4>
      <div className="mb-2">
        <p>Todo ID: {todo.id}</p>
        <a
          id="wd-remove-todo"
          className="btn btn-primary"
          href={`${API}/${todo.id}/delete`}
        >
          Remove Todo with ID = {todo.id}
        </a>
      </div>
      <hr />

      <h3>Updating an Item in an Array</h3>
      <h4>Update Title</h4>
      <a
        href={`${API}/${todo.id}/title/${todo.title}`}
        className="btn btn-primary float-end"
      >
        Update Todo
      </a>
      <FormControl
        defaultValue={todo.id}
        className="w-25 float-start me-2"
        onChange={(e) => setTodo({ ...todo, id: e.target.value })}
      />
      <FormControl
        defaultValue={todo.title}
        className="w-50 float-start"
        onChange={(e) => setTodo({ ...todo, title: e.target.value })}
      />
      <br />
      <br />
      <hr />

      <h4>Update Description</h4>
      <div className="mb-2">
        <FormControl
          id="wd-update-description"
          defaultValue={todo.description}
          className="w-50 mb-2"
          onChange={(e) => setTodo({ ...todo, description: e.target.value })}
          placeholder="Enter description"
        />
        <a
          id="wd-update-description-btn"
          className="btn btn-primary"
          href={`${API}/${todo.id}/description/${encodeURIComponent(todo.description)}`}
        >
          Update Description
        </a>
      </div>
      <hr />

      <h4>Update Completed Status</h4>
      <div className="mb-2">
        <label className="me-2">
          <input
            id="wd-update-completed-checkbox"
            type="checkbox"
            checked={todo.completed}
            onChange={(e) => setTodo({ ...todo, completed: e.target.checked })}
          />
          Completed
        </label>
        <a
          id="wd-update-completed-btn"
          className="btn btn-primary"
          href={`${API}/${todo.id}/completed/${todo.completed}`}
        >
          Update {todo.completed ? "Incomplete" : "Complete"} Todo ID ={" "}
          {todo.id}
        </a>
      </div>
      <hr />
      <hr />
    </div>
  );
}
