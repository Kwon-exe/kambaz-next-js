import mongoose from "mongoose";

const choiceSchema = new mongoose.Schema({ _id: String, text: String }, { _id: false });

const questionSchema = new mongoose.Schema(
  {
    _id: String,
    type: {
      type: String,
      enum: ["MULTIPLE_CHOICE", "TRUE_FALSE", "FILL_IN_BLANK"],
      default: "MULTIPLE_CHOICE",
    },
    title: { type: String, default: "" },
    question: { type: String, default: "" },
    points: { type: Number, default: 1 },
    choices: [choiceSchema],
    correctAnswer: String,
    possibleAnswers: [String],
  },
  { _id: false },
);

const quizSchema = new mongoose.Schema(
  {
    _id: String,
    course: { type: String, ref: "CourseModel" },
    title: { type: String, default: "Unnamed Quiz" },
    description: { type: String, default: "" },
    quizType: {
      type: String,
      enum: ["GRADED_QUIZ", "PRACTICE_QUIZ", "GRADED_SURVEY", "UNGRADED_SURVEY"],
      default: "GRADED_QUIZ",
    },
    assignmentGroup: {
      type: String,
      enum: ["QUIZZES", "EXAMS", "ASSIGNMENTS", "PROJECT"],
      default: "QUIZZES",
    },
    shuffleAnswers: { type: Boolean, default: true },
    timeLimit: { type: Number, default: 20 },
    timeLimitEnabled: { type: Boolean, default: true },
    multipleAttempts: { type: Boolean, default: false },
    howManyAttempts: { type: Number, default: 1 },
    showCorrectAnswers: { type: String, default: "immediately" },
    accessCode: { type: String, default: "" },
    oneQuestionAtATime: { type: Boolean, default: true },
    webcamRequired: { type: Boolean, default: false },
    lockQuestionsAfterAnswering: { type: Boolean, default: false },
    dueDate: String,
    availableDate: String,
    untilDate: String,
    published: { type: Boolean, default: false },
    questions: [questionSchema],
  },
  { collection: "quizzes" },
);

export default quizSchema;
