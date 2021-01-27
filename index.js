const form = document.querySelector(".js-form");
const input = document.querySelector(".js-input");
const pendingUl = document.querySelector(".js-pending-ul");
const body = document.body;

let pendingToDos = [];

const PENDING = "PENDING";
const FINISHED = "FINISHED";

function createToDo(text) {
  return {
    id: String(Date.now()),
    text,
  };
}

function deletePendingToDo(id) {
  pendingToDos = pendingToDos.filter((todo) => todo.id !== id);
}

function deleteToDo(e) {
  const li = e.target.parentNode;
  li.remove();
  deletePendingToDo(li.id);
}

function createLi(todo) {
  const li = document.createElement("li");
  const span = document.createElement("span");
  const delBtn = document.createElement("button");
  li.innerText = todo.text;
  li.id = todo.id;
  delBtn.innerText = "삭제";
  delBtn.addEventListener("click", deleteToDo);
  li.append(span);
  li.append(delBtn);
  return li;
}

function displayPendingToDo(todo) {
  const li = createLi(todo);
  pendingUl.appendChild(li);
}

function handleSubmit(e) {
  e.preventDefault();
  const text = input.value;
  const todo = createToDo(text);
  pendingToDos.push(todo);
  input.value = "";
  displayPendingToDo(todo);
}

form.addEventListener("submit", handleSubmit);
