import express from 'express'
import Hello from "./Hello.js"
import Lab5 from "../app/labs/lab5/index.js";
const app = express()
Lab5(app);
Hello(app)
app.listen(4000)