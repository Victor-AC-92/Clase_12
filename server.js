const express = require('express')
const fs = require('fs')
const app = express()
const http = require('http')
const server = http.createServer(app)
const {Server} = require('socket.io')
const io = new Server(server)
const {engine} = require('express-handlebars')


class Producto {
    constructor (nombre, precio, url){
        this.nombre = nombre;
        this.precio = precio;
        this.url = url;
    }
}

let productos = []
let messages = [
    {author: "Juan", text: "Hola!"}
]

//Configuracion Handlebars
app.engine('handlebars', engine())
app.use(express.urlencoded({extended: true}))
app.set('views', './views')
app.set('view engine', 'handlebars')


app.use(express.static('public'))

app.post('/productos', (req, res) => {
    productos.push(req.body)
    console.log(productos);
    res.redirect('/')
})

app.get('/', (req, res) => {
    res.render('formulario', {productos})
})

io.on('connection', (socket) => {
    console.log('Un cliente se ha conectado');
    socket.emit('messages', messages);

    socket.on('new-message', data => {
        messages.push(data);
        io.sockets.emit('messages', messages);
    });
});

const PORT = 8080

const srv = server.listen(PORT, () => console.log(`Servidor http con WebSocket escuchando el puerto ${srv.address().port}`))
srv.on('error', error => console.log(`Error en el servidor ${error}`))