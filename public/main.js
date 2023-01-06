let socket = io.connect()

socket.on('messages', data => {
    console.log(data)
    renderizar(data)
});

function renderizar(data) {
    let html = data.map((elem, index) => {
        return (`<div>
        <strong style="color: blue">${elem.author}</strong>
        <label style="color: brown">${elem.time}: </label>
        <em style="color: green">${elem.text}</em>
        </div>
        `)
    }).join(" ");
    document.getElementById('messages').innerHTML = html
}

function addMessage(e) {
    

    let message = {
        author: document.getElementById('email').value,
        time: new Date(),
        text: document.getElementById('texto').value
    }

    socket.emit("new-message", message)

    document.getElementById('email').value = ""
    document.getElementById('texto').value = ""

    return false;
}

socket.on('messages', data => {renderizar(data);});