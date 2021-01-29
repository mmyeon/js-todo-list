const form = document.querySelector(".js-form");
const input = document.querySelector(".js-input");
const pendingUl = document.querySelector(".js-pending-ul");
const finishedUl = document.querySelector(".js-finished-ul");

let pendingList;
let finishedList;

const PENDING = "PENDING";
const FINISHED = "FINISHED";

init();

function getTaskObject(text) {
  return {
    id: String(Date.now()),
    text,
  };
}

function saveToStorage(todos) {
  todos === pendingList
    ? localStorage.setItem(PENDING, JSON.stringify(todos))
    : localStorage.setItem(FINISHED, JSON.stringify(todos));
}

function deletePendingToDo(id) {
  pendingList = pendingList.filter((todo) => todo.id !== id);
}

function deleteFinishedToDo(id) {
  finishedList = finishedList.filter((todo) => todo.id !== id);
}

function deleteToDo(e) {
  const li = e.target.parentNode;
  li.remove();
  deletePendingToDo(li.id);
  saveToStorage(pendingList);
  deleteFinishedToDo(li.id);
  saveToStorage(finishedList);
}

function createTodoItem(todo) {
  const li = document.createElement("li");
  const label = document.createElement("span");
  const delBtn = document.createElement("button");
  label.innerText = todo.text;
  li.id = todo.id;
  delBtn.innerText = "삭제";
  delBtn.addEventListener("click", deleteToDo);
  li.append(label);
  li.append(delBtn);
  return li;
}

function moveToDoToFinished(id) {
  const newToDo = pendingList.filter((todo) => todo.id === id);
  finishedList.push(...newToDo);
}

function moveBackToPending(id) {
  const selectedTodo = finishedList.filter((todo) => todo.id === id);
  finishedList = finishedList.filter((todo) => todo.id !== id);
  pendingList.push(...selectedTodo);
}

// finished => pending

function revertToDo(e) {
  const li = e.target.parentNode;

  const revertBtn = e.target;
  revertBtn.remove();

  const completeBtn = document.createElement("button");
  completeBtn.innerText = "완료";
  completeBtn.addEventListener("click", completeToDo);
  li.append(completeBtn);

  pendingUl.append(li);
  moveBackToPending(li.id);
  saveToStorage(pendingList);
  saveToStorage(finishedList);
}

// pending => finished
function completeToDo(e) {
  const li = e.target.parentNode;

  const completeBtn = e.target;
  completeBtn.remove();

  const revertBtn = document.createElement("button");
  revertBtn.innerText = "되돌리기";
  revertBtn.addEventListener("click", revertToDo);
  li.append(revertBtn);

  finishedUl.append(li);
  moveToDoToFinished(li.id);
  saveToStorage(finishedList);
  deletePendingToDo(li.id);
  saveToStorage(pendingList);
}

function displayPendingToDo(todo) {
  const todoItem = createTodoItem(todo);

  const completeBtn = document.createElement("button");
  completeBtn.innerText = "완료";
  completeBtn.addEventListener("click", completeToDo);

  todoItem.append(completeBtn);

  pendingUl.appendChild(li);
}

function displayFinishedToDo(todo) {
  const li = createTodoItem(todo);
  const revertBtn = document.createElement("button");
  revertBtn.innerText = "되돌리기";
  revertBtn.addEventListener("click", revertToDo);
  finishedUl.appendChild(li);
  li.append(revertBtn);
}

function handleSubmit(e) {
  e.preventDefault();
  const text = input.value;
  const todo = getTaskObject(text);
  pendingList.push(todo);
  input.value = "";
  displayPendingToDo(todo);
  saveToStorage(pendingList);
}

function loadState() {
  pendingList = JSON.parse(localStorage.getItem(PENDING)) || [];
  finishedList = JSON.parse(localStorage.getItem(FINISHED)) || [];
}

function restoreState() {
  pendingList.forEach((todo) => displayPendingToDo(todo));
  finishedList.forEach((todo) => displayFinishedToDo(todo));
}

function init() {
  form.addEventListener("submit", handleSubmit);
  loadState();
  restoreState();
}

function getPendionList() {
  return JSON.parse(localStorage.getItem(PENDING)) || [];
}
