const Joi = require("joi");
const express = require("express");
const app = express();

app.use(express.json()); // By default express does not support json. This allows json object can be added to the request(see the post request).

const courses = [
  { id: 1, name: "course1" },
  { id: 2, name: "course2" },
  { id: 3, name: "course3" },
];

app.get("/", (req, res) => {
  res.send("Hello World");
});

//GET===========================================================================================
app.get("/api/courses", (req, res) => {
  res.send(courses);
});

//GET BY ID===========================================================================================
app.get("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));

  if (!course)
    return res.status(404).send("The course with the given ID was not found");

  res.send(course);
});

//CREATE===========================================================================================
app.post("/api/courses", (req, res) => {
  //validating the request body input
  const { error } = validateCourse(req.body);

  if (error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };

  courses.push(course);

  res.send(course);
});

//UPDATE===========================================================================================
app.put("/api/courses/:id", (req, res) => {
  //look up the course
  const course = courses.find((c) => c.id === parseInt(req.params.id));

  //if not existing, return 404
  if (!course)
    return res.status(404).send("The course with the given ID was not found");

  //validate
  const { error } = validateCourse(req.body);

  //if invalid, return 400 - bad request
  if (error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  //update the course
  course.name = req.body.name;
  //return the updated course
  res.send(course);
});

//DELETE===========================================================================================
app.delete("/api/courses/:id", (req, res) => {
  //look up the course
  const course = courses.find((c) => c.id === parseInt(req.params.id));

  //if not existing, return 404
  if (!course)
    return res.status(404).send("The course with the given ID was not found");

  //delete
  const index = courses.indexOf(course);
  courses.splice(index, 1);

  //return the same course
  res.send(course);
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("Server started on port 3000");
});

function validateCourse(course) {
  const schema = {
    name: Joi.string().min(3).required(),
  };
  return Joi.validate(course, schema);
}

// 404 - Not Found
// 400 - Bad Request
// 200 - OK
