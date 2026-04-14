import model from "./model.js";

export default function EnrollmentsDao(db) {
  function findEnrollmentsForUser(userId) {
    return model.find({ user: userId });
  }

  async function findCoursesForUser(userId) {
    const enrollments = await model.find({ user: userId }).populate("course");
    return enrollments.map((enrollment) => enrollment.course);
  }

  async function findUsersForCourse(courseId) {
    const enrollments = await model.find({ course: courseId }).populate("user");
    return enrollments.map((enrollment) => enrollment.user);
  }

  async function enrollUserInCourse(userId, courseId) {
    const existingEnrollment = await model.findOne({
      user: userId,
      course: courseId,
    });
    if (existingEnrollment) {
      return existingEnrollment;
    }

    return model.create({
      _id: `${userId}-${courseId}`,
      user: userId,
      course: courseId,
    });
  }

  function unenrollUserFromCourse(userId, courseId) {
    return model.deleteOne({ user: userId, course: courseId });
  }

  function unenrollAllUsersFromCourse(courseId) {
    return model.deleteMany({ course: courseId });
  }

  return {
    findEnrollmentsForUser,
    findCoursesForUser,
    findUsersForCourse,
    enrollUserInCourse,
    unenrollUserFromCourse,
    unenrollAllUsersFromCourse,
  };
}
