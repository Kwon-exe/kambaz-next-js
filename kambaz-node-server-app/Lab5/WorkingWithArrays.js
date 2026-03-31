let todos = [
  { id: 1, title: "Task 1", description: "First task", completed: false },
  { id: 2, title: "Task 2", description: "Second task", completed: true },
  { id: 3, title: "Task 3", description: "Third task", completed: false },
  { id: 4, title: "Task 4", description: "Fourth task", completed: true },
];

export default function WorkingWithArrays(app) {
  const getTodos = (req, res) => {
    const { completed } = req.query;
    if (completed !== undefined) {
      const completedBool = completed === "true";
      const completedTodos = todos.filter((t) => t.completed === completedBool);
      res.json(completedTodos);
      return;
    }
    res.json(todos);
  };

  const createNewTodo = (req, res) => {
    const newTodo = {
      id: new Date().getTime(),
      title: "New Task",
      completed: false,
    };
    todos.push(newTodo);
    res.json(newTodo);
  };

  const getTodoById = (req, res) => {
    const { id } = req.params;
    const todo = todos.find((t) => t.id === parseInt(id));
    res.json(todo);
  };

  const removeTodo = (req, res) => {
    const { id } = req.params;
    const todoIndex = todos.findIndex((t) => t.id === parseInt(id));
    if (todoIndex !== -1) {
      todos.splice(todoIndex, 1);
    }
    res.json(todos);
  };

  const updateTodoTitle = (req, res) => {
    const { id, title } = req.params;
    const todo = todos.find((t) => t.id === parseInt(id));
    if (todo) {
      todo.title = title;
    }
    res.json(todos);
  };

  const updateTodo = (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;
    const todoIndex = todos.findIndex((t) => t.id === parseInt(id));
    if (todoIndex !== -1) {
      todos[todoIndex] = {
        ...todos[todoIndex],
        ...updatedData,
        id: parseInt(id),
      };
    }
    res.json(todos[todoIndex] || null);
  };

  const postTodo = (req, res) => {
    const newTodo = {
      id: new Date().getTime(),
      ...req.body,
    };
    todos.push(newTodo);
    res.status(201).json(newTodo);
  };

  app.get("/lab5/todos", getTodos);
  app.get("/lab5/todos/create", createNewTodo);
  app.post("/lab5/todos", postTodo);
  app.get("/lab5/todos/:id", getTodoById);
  app.get("/lab5/todos/:id/delete", removeTodo);
  app.delete("/lab5/todos/:id", removeTodo);
  app.put("/lab5/todos/:id", updateTodo);
  app.get("/lab5/todos/:id/title/:title", updateTodoTitle);
}
