const express = require('express');
const app = express();
const courses = require('./data/courses');
const users = require ('./data/users');
const enrollments = require ('./data/enrollments');
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.set('port', process.env.PORT || 3001);

app.locals = {
  title: 'San Junipero Server',
  users,
  enrollments,
  courses
}

//GET all courses
app.get('/courses', (request, response) => {
  const courses = app.locals.courses;
  response.json({ courses })
})

//GET student by id
app.get('/users/:id', (request, response) => {
  const { id } = request.params;
  const user = app.locals.users.find(user => user.id.toString() === id);
  if (!user) {
    return response.status(404).json({
      message: "Cannot find user with that ID."
    });
  }
  response.status(200).json(user)
});

//GET enrollments by userId
app.get('/users/enrollments/:id', (request, response) => {
  const { id } = request.params;
  const userEnrollments = app.locals.enrollments.filter(enrollment => enrollment.userId.toString() === id);

  response.status(200).json(userEnrollments);
});

//DELETE an enrollment by enrollmentId
app.delete('/enrollments/:id', (request, response) => {
  const { id } = request.params;
  const enrollmentList = app.locals.enrollments.filter(enrollment => enrollment.enrollmentId.toString() !== id);
  app.locals.enrollments = enrollmentList;
  response.status(200).json({ message: `Enrollment with id ${id} has been removed` })
})

//POST an enrollment by userId and courseId
app.post('/enrollments', (request, response) => {
  const enrollmentId = Date.now();
  const enrollment = request.body;

  for (let requiredParameter of ['userId', 'courseId']) {
    if (!enrollment[requiredParameter]) {
      response
        .status(422)
        .send({ error: `Expected format: { userId: <Number>, courseId: <Number> }. You are missing a "${requiredParameter}" property.`})
    }
  }

  const { userId, courseId } = enrollment;
  if (userId && courseId) {
    app.locals.enrollments.push({ enrollmentId, courseId, userId });
    response.status(201).json({ enrollmentId, courseId, userId });
  }
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on http://localhost:${app.get('port')}.`)
})
