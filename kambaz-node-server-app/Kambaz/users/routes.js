import UsersDao from "./dao.js";

export default function UserRoutes(app, db) {
  const dao = UsersDao(db);

  const normalizeUser = (user) => {
    if (!user) return null;
    const plainUser =
      typeof user.toObject === "function" ? user.toObject() : { ...user };
    return {
      ...plainUser,
      _id: plainUser._id ?? plainUser.id ?? plainUser.username,
    };
  };

  const createUser = async (req, res) => {
    const newUser = await dao.createUser(req.body);
    res.json(newUser);
  };

  const deleteUser = async (req, res) => {
    const { userId } = req.params;
    const status = await dao.deleteUser(userId);
    res.json(status);
  };

  const findAllUsers = async (req, res) => {
    // Fallback parser protects against environments where req.query is not populated.
    const query = req.query || {};
    let role = typeof query.role === "string" ? query.role : "";
    let name = typeof query.name === "string" ? query.name : "";

    if (!role && !name && req.originalUrl?.includes("?")) {
      const search = req.originalUrl.split("?")[1] || "";
      const params = new URLSearchParams(search);
      role = params.get("role") || "";
      name = params.get("name") || "";
    }

    role = role.trim();
    name = name.trim();

    if (role && name) {
      const users = await dao.findUsersByRoleAndPartialName(role, name);
      res.json(users);
      return;
    }
    if (role) {
      const users = await dao.findUsersByRole(role);
      res.json(users);
      return;
    }
    if (name) {
      const users = await dao.findUsersByPartialName(name);
      res.json(users);
      return;
    }
    const users = await dao.findAllUsers();
    res.json(users.map(normalizeUser));
  };

  const findUserById = async (req, res) => {
    const { userId } = req.params;
    const user = await dao.findUserById(userId);
    res.json(normalizeUser(user));
  };

  const updateUser = async (req, res) => {
    const userId = req.params.userId;
    const userUpdates = req.body;
    await dao.updateUser(userId, userUpdates);
    const currentUser = req.session["currentUser"];
    if (currentUser && currentUser._id === userId) {
      const updatedCurrentUser = { ...currentUser, ...userUpdates };
      req.session["currentUser"] = updatedCurrentUser;
      res.json(normalizeUser(updatedCurrentUser));
      return;
    }
    const updatedUser = await dao.findUserById(userId);
    res.json(normalizeUser(updatedUser));
  };

  const signup = async (req, res) => {
    const user = await dao.findUserByUsername(req.body.username);
    if (user) {
      res.status(400).json({ message: "Username already taken" });
      return;
    }
    const currentUser = await dao.createUser(req.body);
    const normalizedUser = normalizeUser(currentUser);
    req.session["currentUser"] = normalizedUser;
    res.json(normalizedUser);
  };

  const signin = async (req, res) => {
    const { username, password } = req.body;
    const currentUser = await dao.findUserByCredentials(username, password);
    if (currentUser) {
      const normalizedUser = normalizeUser(currentUser);
      req.session["currentUser"] = normalizedUser;
      res.json(normalizedUser);
    } else {
      res.status(401).json({ message: "Unable to login. Try again later." });
    }
  };

  const signout = (req, res) => {
    req.session.destroy();
    res.sendStatus(200);
  };

  const profile = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    res.json(normalizeUser(currentUser));
  };

  app.post("/api/users", createUser);
  app.get("/api/users", findAllUsers);
  app.get("/api/users/:userId", findUserById);
  app.put("/api/users/:userId", updateUser);
  app.delete("/api/users/:userId", deleteUser);
  app.post("/api/users/signup", signup);
  app.post("/api/users/signin", signin);
  app.post("/api/users/signout", signout);
  app.post("/api/users/profile", profile);
}
