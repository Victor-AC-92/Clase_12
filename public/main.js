let socket = io.connect()

socket.on('messages', data => {
    console.log(data)
    renderizar(data)
});

function renderizar(data) {
    let html = data.map((elem, index) => {
        return (`<div>
        <strong style="color: blue">${elem.author}</strong>
        <label style="color: brown">${elem.date}: </label>
        <em style="color: green">${elem.text}</em>
        </div>
        `)
    }).join(" ");
    document.getElementById('messages').innerHTML = html
}

function addMessage(e) {
    let date = new Date().toLocaleString

    let message = {
        author: document.getElementById('email').value,
        messageDate: date,
        text: document.getElementById('texto').value
    }

    socket.emit("new-message", message)

    document.getElementById('email').value = ""
    document.getElementById('texto').value = ""

    fs.promises.appendFile('Entregas\Clase_12\public\logMensajes.txt', JSON.stringify(message, ',', 2))
                    .then(() => console.log(`Mensaje guardado`))
                    .catch( error => console.log(error))

    return false;
}

socket.on('messages', data => {renderizar(data);});