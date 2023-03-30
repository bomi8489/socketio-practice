const socket = io();

const welcome = document.getElementById("welcome");
const enterForm = welcome.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;

let roomName;

function addMessage(message) {
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = message;
    ul.appendChild(li);
}

function handleNicknameSubmit(event) {
    event.preventDefault();
    const input = room.querySelector("#name input");
    socket.emit("nickname", input.value);
}

// 메세지 전송버튼 누르면 실행
function handleMessageSubmit(event) {
    event.preventDefault();
    const input = room.querySelector("#msg input");
    const msg = input.value;
    socket.emit("new_message", input.value, roomName, () => {
        addMessage(`You: ${msg}`);
    });
    input.value = "";
}

//방 호출 함수
function showRoom() {
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName}`;
    const msgForm = room.querySelector("#msg");
    const nameForm = room.querySelector("name");
    msgForm.addEventListener("submit", handleMessageSubmit);
    nameForm.addEventListener("submit", handleNicknameSubmit);
}

//방 입장 함수
function handleRoomSubmit(event) {
    const roomNameInput = enterForm.querySelector("#roomName");
    const nickNameInput = enterForm.querySelector("#name");
    event.preventDefault();
    socket.emit("enter_room", roomNameInput.value, nickNameInput.value ,showRoom);
    roomName = roomNameInput.value;
    roomNameInput.value = "";
}

enterForm.addEventListener("submit", handleRoomSubmit);

//새로운 user socket 입장시 
socket.on("welcome", (user) => {
    addMessage(`${user} joined the room`);  
})

//유저가 방에서 나갈시
socket.on("bye", (user) => {
    addMessage(`${user} left ㅠㅠ`);
})

//새로운 메세지 보낼시
socket.on("new_message", addMessage);