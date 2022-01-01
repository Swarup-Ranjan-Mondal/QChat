const messageContainer = document.querySelector(".message-container");
const inputText = document.getElementById("input-text");
const form = document.querySelector(".input-container");

const socket = io("http://localhost:3000");

const name = prompt("Enter your name");

socket.emit("new-user", name);

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = inputText.value;
  if (message == "") {
    return;
  }
  socket.emit("send", message);
  appendMessage("You: " + message, "right");
  inputText.value = "";
});

socket.on("user-joined", (name) => {
  const message = `${name} joined the chat`;
  appendMessage(message, "middle");
});

socket.on("receive", (data) => {
  const message = `${data.name}: ${data.message}`;
  appendMessage(message, "left");
});

socket.on("disconnected", (name) => {
  const message = `${name} left the chat`;
  appendMessage(message, "middle");
});

function appendMessage(message, position) {
  const messageElement = document.createElement("div");
  const nameElement = document.createElement("p");
  const textElement = document.createElement("p");
  const dateElement = document.createElement("p");
  const date = new Date().toLocaleTimeString();
  const index = date.lastIndexOf(":");

  if (position != "middle") {
    nameElement.innerText = message.substring(0, message.indexOf(":"));
    nameElement.classList.add("sender-name");
    messageElement.appendChild(nameElement);
  }

  const messageStartIndex = position != "middle" ? message.indexOf(":") + 2 : 0;
  textElement.innerText = message.substring(messageStartIndex);
  textElement.classList.add("message-text");
  messageElement.appendChild(textElement);

  if (position != "middle") {
    dateElement.innerText =
      date.substring(0, index) + date.substring(index + 3);
    dateElement.classList.add("date");
    messageElement.appendChild(dateElement);
  }
  messageElement.classList.add("message");
  messageElement.classList.add(position);
  messageContainer.appendChild(messageElement);
  messageContainer.scrollTop = messageContainer.scrollHeight;
}
