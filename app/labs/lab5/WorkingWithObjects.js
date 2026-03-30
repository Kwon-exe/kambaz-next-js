
const assignment = {
  id: 1, title: "NodeJS Assignment",
  description: "Create a NodeJS server with ExpressJS",
  due: "2021-10-10", completed: false, score: 0,
};

const module = {
  id: "M101",
  name: "Intro to Node",
  description: "Build simple HTTP routes with Express",
  course: "CS4550",
};

export default function WorkingWithObjects(app) {
  const getAssignment = (req, res) => {
    res.json(assignment);
  };
  const getAssignmentTitle = (req, res) => {
    res.json(assignment.title);
  };
  const getModule = (req, res) => {
    res.json(module);
  };
  const getModuleName = (req, res) => {
    res.json(module.name);
  };
  const updateModuleName = (req, res) => {
    module.name = req.params.name;
    res.json(module);
  };
  const updateModuleDescription = (req, res) => {
    module.description = req.params.description;
    res.json(module);
  };
  const updateAssignmentScore = (req, res) => {
    assignment.score = Number(req.params.score);
    res.json(assignment);
  };
  const updateAssignmentCompleted = (req, res) => {
    assignment.completed = req.params.completed === "true";
    res.json(assignment);
  };

  app.get("/lab5/module", getModule);
  app.get("/lab5/module/name", getModuleName);
  app.get("/lab5/module/name/:name", updateModuleName);
  app.get("/lab5/module/description/:description", updateModuleDescription);

  app.get("/lab5/assignment/score/:score", updateAssignmentScore);
  app.get("/lab5/assignment/completed/:completed", updateAssignmentCompleted);
  app.get("/lab5/assignment/title", getAssignmentTitle);
  app.get("/lab5/assignment", getAssignment);
}
