const form = document.querySelector(".js-form");
const input = document.querySelector(".js-input");
const pendingUl = document.querySelector(".js-pending-ul");
const finishedUl = document.querySelector(".js-finished-ul");
const body = document.body;

let pendingToDos = [];
let finishedToDos = [];

const PENDING = "PENDING";
const FINISHED = "FINISHED";

function createToDo(text) {
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

function revertToDo(id) {
  const newTodo = finishedToDos.filter((todo) => todo.id === id);
  finishedToDos = finishedToDos.filter((todo) => todo.id !== id);
  pendingToDos.push(...newTodo);
}

// finished => pending
function handleRevert(e) {
  const li = e.target.parentNode;
  const btn = e.target;
  btn.innerText = "완료";
  pendingUl.append(li);
  revertToDo(li.id);
  saveToStorage(pendingToDos);
  saveToStorage(finishedToDos);
}

// pending => finished
function completeToDo(e) {
  const li = e.target.parentNode;
  const revertBtn = e.target;
  revertBtn.innerText = "되돌리기";
  finishedUl.append(li);
  revertBtn.addEventListener("click", handleRevert);
  moveToDoToFinished(li.id);
  saveToStorage(finishedToDos);
  deletePendingToDo(li.id);
  saveToStorage(pendingToDos);
}

function displayPendingToDo(todo) {
  const li = createLi(todo);
  pendingUl.appendChild(li);
  const completeBtn = document.createElement("button");
  completeBtn.innerText = "완료";
  completeBtn.addEventListener("click", completeToDo);
  li.append(completeBtn);
}

function handleSubmit(e) {
  e.preventDefault();
  const text = input.value;
  const todo = createToDo(text);
  pendingToDos.push(todo);
  input.value = "";
  displayPendingToDo(todo);
  saveToStorage(pendingToDos);
}

form.addEventListener("submit", handleSubmit);
