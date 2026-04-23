import userModel from "./users/model.js";
import courseModel from "./courses/model.js";
import enrollmentModel from "./enrollments/model.js";
import quizModel from "./quizzes/model.js";
import db from "./Database/index.js";
import quizzes from "./Database/quizzes.js";

export default function Seeding(app) {
  app.get("/api/seeding", async (req, res) => {
    try {
      await userModel.deleteMany({});
      await courseModel.deleteMany({});
      await enrollmentModel.deleteMany({});
      await quizModel.deleteMany({});

      await userModel.insertMany(db.users);
      await courseModel.insertMany(db.courses);
      await enrollmentModel.insertMany(db.enrollments);
      await quizModel.insertMany(quizzes);

      res.json({ message: "Database seeded successfully" });
    } catch (err) {
      console.error("Seeding error:", err);
      res.status(500).json({ message: "Seeding failed", error: err.message });
    }
  });
}
