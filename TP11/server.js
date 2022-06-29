const express = require('express')

const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')

const Contenedor = require('./src/controllers/contenedorMensajes.js')
const Container = require('./src/controllers/contenedorProductos.js')

const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

const fakerProd = require('./src/faker/faker')
const normalizar = require('./src/normalizr/normalizr')

app.use(express.static('./src/public'))
app.set('view engine', 'ejs')

app.get('/', async (req, res) => {
    res.render('index.ejs', { root: __dirname })
})

app.get('/productos-test', async (req, res) => {

    for (let i = 0; i < 5; i++) {
        const productos = fakerProd()
        const add = await Container.insertarProductos(productos)
    }
    res.redirect('/')
})


io.on('connection', async (sockets) => {
    console.log('Un cliente se ha conectado!: ' + sockets.id)

    sockets.emit('productos', await Container.listarProductos())
    sockets.emit('messages', await Contenedor.getMSGS())
    const listNorm = await normalizar.normalizedList();
    await normalizar.denormalizedList(listNorm);
    

    sockets.on('new-producto', async data => {
        await Container.insertarProductos(data)
        console.log(data)

        io.sockets.emit('productos', await Container.listarProductos())
    })
    sockets.on('new-message', async dato => {
        console.log(dato)
        const author = dato.author
        const messageText = dato.text
        const fecha = dato.fecha
        const hora = dato.hora
        await Contenedor.saveMSG(author, messageText, fecha, hora)

        io.sockets.emit('messages', await Contenedor.getMSGS())
    })
})





const PORT = 8080
httpServer.listen(PORT, () => console.log('Iniciando en el puerto: ' + PORT))