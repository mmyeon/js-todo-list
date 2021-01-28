const form = document.querySelector(".js-form");
const input = document.querySelector(".js-input");
const pendingUl = document.querySelector(".js-pending-ul");
const finishedUl = document.querySelector(".js-finished-ul");

let pendingToDos;
let finishedToDos;

const PENDING = "PENDING";
const FINISHED = "FINISHED";

function getObj(text) {
  return {
    id: String(Date.now()),
    text,
  };
}

function saveToStorage(todos) {
  todos === pendingToDos
    ? localStorage.setItem(PENDING, JSON.stringify(todos))
    : localStorage.setItem(FINISHED, JSON.stringify(todos));
}

function deletePendingToDo(id) {
  pendingToDos = pendingToDos.filter((todo) => todo.id !== id);
}

function deleteFinishedToDo(id) {
  finishedToDos = finishedToDos.filter((todo) => todo.id !== id);
}

function deleteToDo(e) {
  const li = e.target.parentNode;
  li.remove();
  deletePendingToDo(li.id);
  saveToStorage(pendingToDos);
  deleteFinishedToDo(li.id);
  saveToStorage(finishedToDos);
}

function createLi(todo) {
  const li = document.createElement("li");
  const span = document.createElement("span");
  const delBtn = document.createElement("button");
  span.innerText = todo.text;
  li.id = todo.id;
  delBtn.innerText = "삭제";
  delBtn.addEventListener("click", deleteToDo);
  li.append(span);
  li.append(delBtn);
  return li;
}

function moveToDoToFinished(id) {
  const newToDo = pendingToDos.filter((todo) => todo.id === id);
  finishedToDos.push(...newToDo);
}

function moveBackToPending(id) {
  const selectedTodo = finishedToDos.filter((todo) => todo.id === id);
  finishedToDos = finishedToDos.filter((todo) => todo.id !== id);
  pendingToDos.push(...selectedTodo);
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
  saveToStorage(pendingToDos);
  saveToStorage(finishedToDos);
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
  saveToStorage(finishedToDos);
  deletePendingToDo(li.id);
  saveToStorage(pendingToDos);
}

function displayPendingToDo(todo) {
  const li = createLi(todo);

  const completeBtn = document.createElement("button");
  completeBtn.innerText = "완료";
  completeBtn.addEventListener("click", completeToDo);

  li.append(completeBtn);

  pendingUl.appendChild(li);
}

function displayFinishedToDo(todo) {
  const li = createLi(todo);
  const revertBtn = document.createElement("button");
  revertBtn.innerText = "되돌리기";
  revertBtn.addEventListener("click", revertToDo);
  finishedUl.appendChild(li);
  li.append(revertBtn);
}

function handleSubmit(e) {
  e.preventDefault();
  const text = input.value;
  const todo = getObj(text);
  pendingToDos.push(todo);
  input.value = "";
  displayPendingToDo(todo);
  saveToStorage(pendingToDos);
}

function loadPendingToDos() {
  pendingToDos = JSON.parse(localStorage.getItem(PENDING)) || [];
  pendingToDos.forEach((todo) => displayPendingToDo(todo));
}

function loadFinishedToDos() {
  finishedToDos = JSON.parse(localStorage.getItem(FINISHED)) || [];
  finishedToDos.forEach((todo) => displayFinishedToDo(todo));
}

function init() {
  form.addEventListener("submit", handleSubmit);
  loadPendingToDos();
  loadFinishedToDos();
}

init();
