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

function checkIfUserAlreadyExist(request, response, next) {
  const { username } = request.body;
  const existUser = users.find(user => user.username===username);
  if(existUser) {
    return response.status(400).json({ error: "User already exist" });
  }
  return next();
}

function checkIfExistTodo(request, response, next) {
  const { user } = request;
  const { id } = request.params;
  const userTodo = user.todos.find(item => item.id === id);
  if(!userTodo) {
    return response.status(404).json({ error: "Todo Not Found" });
  }
  console.log(userTodo)
  request.userTodoFound = userTodo;
  return next();
}

app.post('/users', checkIfUserAlreadyExist, (request, response) => {
  const { name, username } = request.body;
  const user = {
    id: uuidv4(),
    name: name,
    username: username,
    todos: []
  };

  users.push(user);

  return response.status(201).json(user);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  return response.json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;
  const { user } = request;
  
  const todo = {
    id: uuidv4(),
    title: title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  };

  user.todos.push(todo);

  return response.status(201).json(todo);
});

app.put('/todos/:id', checksExistsUserAccount, checkIfExistTodo, (request, response) => {
  const { title, deadline } = request.body;
  const { userTodoFound } = request;

  userTodoFound.title = title;
  userTodoFound.deadline = new Date(deadline);
  
  return response.status(204).json(userTodoFound);
});

app.patch('/todos/:id/done', checksExistsUserAccount, checkIfExistTodo, (request, response) => {
  const { userTodoFound } = request;
  
  userTodoFound.done = !userTodoFound.done;
  return response.status(201).json(todoFound);
});

app.delete('/todos/:id', checksExistsUserAccount, checkIfExistTodo, (request, response) => {
  const { user } = request;
  const { userTodoFound } = request;
  
  user.todos.splice(user.todos.indexOf(userTodoFound), 1);

  return response.status(204).json(user.todos);
});

module.exports = app;