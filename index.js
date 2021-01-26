const form = document.querySelector(".js-form");
const input = document.querySelector(".js-input");
const pendingUl = document.querySelector(".js-pending-ul");

let pendingToDos = [];

const PENDING = "PENDING";
const FINISHED = "FINISHED";

function createToDo(text) {
  return {
    id: Date.now(),
    text,
  };
}

function createLi() {
  const li = document.createElement("li");
  return li;
}

function displayPendingToDo(todo) {
  // 리스트 어펜드하기
  const li = createLi();
  li.innerText = todo.text;
  li.id = todo.id;
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
