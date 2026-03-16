import { create } from "zustand";

interface Todo {
  id?: string;
  title: string;
}

interface TodoStoreState {
  todo: Todo;
  todos: Todo[];
  addTodo: () => void;
  updateTodo: () => void;
  deleteTodo: (todoId: string) => void;
  setTodo: (todo: Todo) => void;
}

const emptyTodo = (): Todo => ({ title: "" });

export const useTodoStore = create<TodoStoreState>((set) => ({
  todo: { title: "Learn Mongo" },
  todos: [
    { id: "1", title: "Learn React" },
    { id: "2", title: "Learn Node" },
  ],
  addTodo: () =>
    set((state) => {
      const title = state.todo.title.trim();
      if (!title) {
        return state;
      }

      return {
        todos: [
          ...state.todos,
          { ...state.todo, id: new Date().getTime().toString(), title },
        ],
        todo: emptyTodo(),
      };
    }),
  updateTodo: () =>
    set((state) => {
      const title = state.todo.title.trim();
      if (!state.todo.id || !title) {
        return state;
      }

      return {
        todos: state.todos.map((item) =>
          item.id === state.todo.id ? { ...state.todo, title } : item,
        ),
        todo: emptyTodo(),
      };
    }),
  deleteTodo: (todoId) =>
    set((state) => ({
      todos: state.todos.filter((item) => item.id !== todoId),
      todo: state.todo.id === todoId ? emptyTodo() : state.todo,
    })),
  setTodo: (todo) => set({ todo }),
}));
