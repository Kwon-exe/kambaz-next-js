import React from "react";
import { useDispatch } from "react-redux";
import { deleteTodo, setTodo } from "./todosReducer";
import { Button, ListGroup } from "react-bootstrap";
export default function TodoItem({ todo }) {
  const dispatch = useDispatch();
  return (
    <ListGroup.Item key={todo.id} className="d-flex align-items-center">
      <span>{todo.title}</span>
      <div className="ms-auto">
        <Button
          variant="primary"
          className="me-2"
          onClick={() => dispatch(setTodo(todo))}
          id="wd-set-todo-click"
        >
          Edit
        </Button>
        <Button
          variant="danger"
          onClick={() => dispatch(deleteTodo(todo.id))}
          id="wd-delete-todo-click"
        >
          Delete
        </Button>
      </div>
    </ListGroup.Item>
  );
}
