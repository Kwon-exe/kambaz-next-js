import { v4 as uuidv4 } from "uuid";
import model from "../courses/model.js";

export default function ModulesDao(db) {
  async function findModulesForCourse(courseId) {
    const course = await model.findById(courseId);
    const embeddedModules = course?.modules ?? [];
    if (embeddedModules.length > 0) {
      return embeddedModules;
    }
    return (db.modules || []).filter((module) => module.course === courseId);
  }

  async function createModule(courseId, module) {
    const newModule = { ...module, _id: uuidv4() };
    const course = await model.findById(courseId);
    if (course) {
      course.modules = course.modules || [];
      course.modules.push(newModule);
      await course.save();
      return newModule;
    }

    // Backward-compatible fallback for legacy non-embedded data.
    db.modules = [...(db.modules || []), { ...newModule, course: courseId }];
    return newModule;
  }

  async function deleteModule(courseId, moduleId) {
    const status = await model.updateOne(
      { _id: courseId },
      { $pull: { modules: { _id: moduleId } } },
    );
    if (!status?.modifiedCount) {
      db.modules = (db.modules || []).filter(
        (module) => module._id !== moduleId,
      );
    }
    return status;
  }

  async function updateModule(courseId, moduleId, moduleUpdates) {
    const course = await model.findById(courseId);
    const module = course?.modules?.id(moduleId);
    if (module) {
      Object.assign(module, moduleUpdates);
      await course.save();
      return module;
    }

    // Backward-compatible fallback for legacy non-embedded data.
    const legacyModule = (db.modules || []).find((m) => m._id === moduleId);
    if (!legacyModule) {
      return null;
    }
    Object.assign(legacyModule, moduleUpdates);
    return legacyModule;
  }

  return {
    findModulesForCourse,
    createModule,
    deleteModule,
    updateModule,
  };
}
