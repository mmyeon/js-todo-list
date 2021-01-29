const form = document.querySelector(".js-form");
const input = document.querySelector(".js-input");
const pendingList = document.querySelector(".js-pending-ul");
const finishedList = document.querySelector(".js-finished-ul");

let pendingTasks;
let finishedTasks;

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
  todos === pendingTasks
    ? localStorage.setItem(PENDING, JSON.stringify(todos))
    : localStorage.setItem(FINISHED, JSON.stringify(todos));
}

function deletePendingToDo(id) {
  pendingTasks = pendingTasks.filter((todo) => todo.id !== id);
}

function deleteFinishedToDo(id) {
  finishedTasks = finishedTasks.filter((todo) => todo.id !== id);
}

function deleteToDo(e) {
  const li = e.target.parentNode;
  li.remove();
  deletePendingToDo(li.id);
  saveToStorage(pendingTasks);
  deleteFinishedToDo(li.id);
  saveToStorage(finishedTasks);
}

function buildGenericLi(todo) {
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
  const newToDo = pendingTasks.filter((todo) => todo.id === id);
  finishedTasks.push(...newToDo);
}

function moveBackToPending(id) {
  const selectedTodo = finishedTasks.filter((todo) => todo.id === id);
  finishedTasks = finishedTasks.filter((todo) => todo.id !== id);
  pendingTasks.push(...selectedTodo);
}

function handleBackClick(e) {
  const li = e.target.parentNode;

  const revertBtn = e.target;
  revertBtn.remove();

  const completeBtn = document.createElement("button");
  completeBtn.innerText = "완료";
  completeBtn.addEventListener("click", handleFinishClick);
  li.append(completeBtn);

  pendingList.append(li);
  moveBackToPending(li.id);
  saveToStorage(pendingTasks);
  saveToStorage(finishedTasks);
}

function handleFinishClick(e) {
  const li = e.target.parentNode;

  const completeBtn = e.target;
  completeBtn.remove();

  const revertBtn = document.createElement("button");
  revertBtn.innerText = "되돌리기";
  revertBtn.addEventListener("click", handleBackClick);
  li.append(revertBtn);

  finishedList.append(li);
  moveToDoToFinished(li.id);
  saveToStorage(finishedTasks);
  deletePendingToDo(li.id);
  saveToStorage(pendingTasks);
}

function paintPendingTask(task) {
  const genericLi = buildGenericLi(task);

  const completeBtn = document.createElement("button");
  completeBtn.innerText = "완료";
  completeBtn.addEventListener("click", handleFinishClick);

  genericLi.append(completeBtn);

  pendingList.append(genericLi);
}

function paintFinishedTask(todo) {
  const genericLi = buildGenericLi(todo);
  const backBtn = document.createElement("button");
  backBtn.innerText = "되돌리기";
  backBtn.addEventListener("click", handleBackClick);
  genericLi.append(backBtn);
  finishedList.append(genericLi);
}

function handleSubmit(e) {
  e.preventDefault();
  const text = input.value;
  const todo = getTaskObject(text);
  pendingTasks.push(todo);
  input.value = "";
  paintPendingTask(todo);
  saveToStorage(pendingTasks);
}

function loadState() {
  pendingTasks = JSON.parse(localStorage.getItem(PENDING)) || [];
  finishedTasks = JSON.parse(localStorage.getItem(FINISHED)) || [];
}

function restoreState() {
  pendingTasks.forEach((task) => paintPendingTask(task));
  finishedTasks.forEach((task) => paintFinishedTask(task));
}

function init() {
  form.addEventListener("submit", handleSubmit);
  loadState();
  restoreState();
}
