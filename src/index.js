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
    return response.status(404).json({ error: "Don't exist this user" });
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
  const { title, deadline } = request.body;
  const { id } = request.params;
  const { user } = request;
 
  const userTodo = user.todos.find(item => item.id === id);
  if(!userTodo) {
    return response.status(404).json({ error: "Todo Not Found" });
  }

  userTodo.title = title;
  userTodo.deadline = new Date(deadline);
  
  return response.status(204).send();
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { id } = request.params;
  const { user } = request;

  const todoFound = user.todos.find(todo => todo.id === id);
  if(!todoFound) {
    return response.status(404).json({ error: "Todo Not Found" })
  }

  todoFound.done = !todoFound.done;

  return response.status(204).send();
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  
});

module.exports = app;