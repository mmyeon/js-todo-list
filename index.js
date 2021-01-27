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

function saveToStorage(todos) {
  todos === pendingToDos
    ? localStorage.setItem(PENDING, JSON.stringify(todos))
    : localStorage.setItem(FINISHED, JSON.stringify(todos));
}

function deletePendingToDo(id) {
  pendingToDos = pendingToDos.filter((todo) => todo.id !== id);
}

function deleteToDo(e) {
  const li = e.target.parentNode;
  li.remove();
  deletePendingToDo(li.id);
  saveToStorage(pendingToDos);
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

function movePendingToDo(id) {
  finishiedToDos = pendingToDos.filter((todo) => todo.id === id);
}

// function completeToDo() {
//   const li = e.target.parentNode;
//   li.remove();
//   movePendingToDo(li.id);
// }

function displayPendingToDo(todo) {
  const li = createLi(todo);
  pendingUl.appendChild(li);
  const completeBtn = document.createElement("button");
  completeBtn.innerText = "완료";
  // completeBtn.addEventListener("click", completeToDo);
  li.append(completeBtn);
  console.log(li);
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
