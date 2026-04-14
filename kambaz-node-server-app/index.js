import express from "express";
import mongoose from "mongoose";
import Hello from "./Hello.js";
import Lab5 from "./Lab5/index.js";
import cors from "cors";
import db from "./Kambaz/Database/index.js";
import UserRoutes from "./Kambaz/users/routes.js";
import CourseRoutes from "./Kambaz/courses/routes.js";
import ModulesRoutes from "./Kambaz/modules/routes.js";
import AssignmentsRoutes from "./Kambaz/assignments/routes.js";
import EnrollmentsRoutes from "./Kambaz/enrollments/routes.js";
import "dotenv/config";
import session from "express-session";
const app = express();

const CONNECTION_STRING =
  process.env.DATABASE_CONNECTION_STRING || "mongodb://127.0.0.1:27017/kambaz";
mongoose.connect(CONNECTION_STRING);

// Extract base origin from CLIENT_URL (strip any path)
const getOrigin = () => {
  const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
  try {
    const url = new URL(clientUrl);
    return `${url.protocol}//${url.host}`;
  } catch {
    return clientUrl;
  }
};

app.use(
  cors({
    credentials: true,
    origin: getOrigin(),
  }),
);

const sessionOptions = {
  secret: process.env.SESSION_SECRET || "kambaz",
  resave: false,
  saveUninitialized: false,
};
if (process.env.SERVER_ENV !== "development") {
  app.set("trust proxy", 1);
  sessionOptions.proxy = true;
  sessionOptions.cookie = {
    sameSite: "none",
    secure: true,
  };
}

app.use(session(sessionOptions));
app.use(express.json());
const port = process.env.PORT || 4000;
UserRoutes(app, db);
CourseRoutes(app, db);
ModulesRoutes(app, db);
AssignmentsRoutes(app, db);
EnrollmentsRoutes(app, db);
Lab5(app);
Hello(app);
app.listen(port);
