const express = require('express')
const fs = require('fs')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
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
    {author: "Juan", time: new Date() ,text: "Hola!"}
]

//Configuracion Handlebars
app.engine('handlebars', engine())
app.use(express.urlencoded({extended: true}))
app.set('views', './views')
app.set('view engine', 'handlebars')


app.use(express.static('./public'))

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
        fs.promises.writeFile('public/logMensajes.txt', JSON.stringify(messages, ',', 2))
                    .then(() => console.log(`Mensaje guardado`))
                    .catch( error => console.log(error))
    });
});

const PORT = 8080

const srv = server.listen(PORT, () => console.log(`Servidor http con WebSocket escuchando el puerto ${srv.address().port}`))
srv.on('error', error => console.log(`Error en el servidor ${error}`))