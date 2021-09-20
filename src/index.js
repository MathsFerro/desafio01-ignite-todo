const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

/**
 * id: uuid;
 * name: string;
 * username: string;
 * todos: []
 */
const users = [];

/**
 * TODO
 * id: uuid;
 * title: string;
 * done: boolean;
 * deadline: Date;
 * created_at: Date;
 */

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;
  const userFound = users.find(user => user.username === username);
  
  if(!userFound) {
    return response.status(400).json({ error: "Don't exist this user" });
  }

  request.user = userFound;

  return next();
}

app.post('/users', (request, response) => {
  const { name, username } = request.body;
  const user = {
    id: uuidv4(),
    name: name,
    username: username,
    todos: []
  };

  users.push(user);

  return response.status(201).send();
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  return response.json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;
  const { user } = request;
  
  user.todos.push({
    id: uuidv4(),
    title: title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  });

  return response.status(201).send();
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  
});

module.exports = app;