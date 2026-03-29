"use client";

import React, { createContext, ReactNode, useContext, useState } from "react";

export interface Todo {
  id?: string;
  title: string;
}

interface TodosContextType {
  todo: Todo;
  todos: Todo[];
  addTodo: () => void;
  deleteTodo: (todoId: string) => void;
  updateTodo: () => void;
  setTodo: (todo: Todo) => void;
}

const initialTodos: Todo[] = [
  { id: "1", title: "Learn React" },
  { id: "2", title: "Learn Node" },
];

const emptyTodo = (): Todo => ({ title: "" });

const TodosContext = createContext<TodosContextType | undefined>(undefined);

export function TodosProvider({ children }: { children: ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [todo, setTodoState] = useState<Todo>({ title: "Learn Mongo" });

  const addTodo = () => {
    if (!todo.title.trim()) return;
    setTodos([
      ...todos,
      {
        ...todo,
        id: new Date().getTime().toString(),
        title: todo.title.trim(),
      },
    ]);
    setTodoState(emptyTodo());
  };

  const deleteTodo = (todoId: string) => {
    setTodos(todos.filter((item) => item.id !== todoId));
    if (todo.id === todoId) {
      setTodoState(emptyTodo());
    }
  };

  const updateTodo = () => {
    if (!todo.id || !todo.title.trim()) return;
    setTodos(
      todos.map((item) =>
        item.id === todo.id ? { ...todo, title: todo.title.trim() } : item,
      ),
    );
    setTodoState(emptyTodo());
  };

  const setTodo = (nextTodo: Todo) => {
    setTodoState(nextTodo);
  };

  return React.createElement(
    TodosContext.Provider,
    { value: { todo, todos, addTodo, deleteTodo, updateTodo, setTodo } },
    children,
  );
}

export function useTodos() {
  const context = useContext(TodosContext);
  if (!context) {
    throw new Error("No Context");
  }
  return context;
}
