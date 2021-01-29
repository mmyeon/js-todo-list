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

function savePendingTask(task) {
  pendingTasks.push(task);
}

function findInPending(taskId) {
  return pendingTasks.find((task) => task.id === taskId);
}

function findInFinished(taskId) {
  return finishedTasks.find((task) => task.id === taskId);
}

function removeFromPending(taskId) {
  pendingTasks = pendingTasks.filter((task) => task.id !== taskId);
}

function removeFromFinished(taskId) {
  finishedTasks = finishedTasks.filter((task) => task.id !== taskId);
}

function addToFinished(task) {
  finishedTasks.push(task);
}

function addToPending(task) {
  pendingTasks.push(task);
}

function deleteTask(e) {
  const li = e.target.parentNode;
  li.parentNode.removeChild(li);
  removeFromPending(li.id);
  removeFromFinished(li.id);
  saveState();
}

function buildGenericLi(task) {
  const li = document.createElement("li");
  const span = document.createElement("span");
  const delBtn = document.createElement("button");
  span.innerText = task.text;
  li.id = task.id;
  delBtn.innerText = "삭제";
  delBtn.addEventListener("click", deleteTask);
  li.append(span, delBtn);
  return li;
}

function handleBackClick(e) {
  const li = e.target.parentNode;
  li.parentNode.removeChild(li);

  const task = findInFinished(li.id);
  removeFromFinished(li.id);
  addToPending(task);
  paintPendingTask(task);
  saveState();
}

function handleFinishClick(e) {
  const li = e.target.parentNode;
  li.parentNode.removeChild(li);
  const task = findInPending(li.id);
  removeFromPending(li.id);
  addToFinished(task);
  paintFinishedTask(task);
  saveState();
}

function paintPendingTask(task) {
  const genericLi = buildGenericLi(task);
  const completeBtn = document.createElement("button");
  completeBtn.innerText = "완료";
  completeBtn.addEventListener("click", handleFinishClick);
  genericLi.append(completeBtn);
  pendingList.append(genericLi);
}

function paintFinishedTask(task) {
  const genericLi = buildGenericLi(task);
  const backBtn = document.createElement("button");
  backBtn.innerText = "되돌리기";
  backBtn.addEventListener("click", handleBackClick);
  genericLi.append(backBtn);
  finishedList.append(genericLi);
}

function handleSubmit(e) {
  e.preventDefault();
  const text = input.value;
  const taskObj = getTaskObject(text);
  input.value = "";
  paintPendingTask(taskObj);
  savePendingTask(taskObj);
  saveState();
}

function saveState() {
  localStorage.setItem(PENDING, JSON.stringify(pendingTasks));
  localStorage.setItem(FINISHED, JSON.stringify(finishedTasks));
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
