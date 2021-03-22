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
  title: 'Guild Project Server',
  users,
  enrollments,
  courses
}

//GET all courses
app.get('/courses', (request, response) => {
  const courses = app.locals.courses;
  response.json({ courses })
})
