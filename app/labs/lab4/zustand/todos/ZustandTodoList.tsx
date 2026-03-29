"use client";

import { Button, FormControl, ListGroup } from "react-bootstrap";
import { useTodoStore } from "./useTodoStore";

export default function ZustandTodoList() {
  const { todo, todos, addTodo, updateTodo, deleteTodo, setTodo } =
    useTodoStore((state) => state);

  return (
    <div id="wd-todo-list-zustand">
      <h2>Todo List</h2>
      <ListGroup>
        <ListGroup.Item className="d-flex align-items-center">
          <FormControl
            className="me-2"
            value={todo.title}
            onChange={(e) => setTodo({ ...todo, title: e.target.value })}
          />
          <Button
            variant="success"
            className="me-2"
            onClick={addTodo}
            id="wd-add-todo-zustand-click"
          >
            Add
          </Button>
          <Button
            variant="warning"
            onClick={updateTodo}
            id="wd-update-todo-zustand-click"
          >
            Update
          </Button>
        </ListGroup.Item>
        {todos.map((item) => (
          <ListGroup.Item key={item.id} className="d-flex align-items-center">
            <span>{item.title}</span>
            <div className="ms-auto">
              <Button
                variant="primary"
                className="me-2"
                onClick={() => setTodo(item)}
                id="wd-set-todo-zustand-click"
              >
                Edit
              </Button>
              <Button
                variant="danger"
                onClick={() => item.id && deleteTodo(item.id)}
                id="wd-delete-todo-zustand-click"
              >
                Delete
              </Button>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
      <hr />
    </div>
  );
}
