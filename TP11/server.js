const express = require('express');

const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');

const ClienteSQL = require('./contenedorProductos');
const optionsSQL = require('./connections/SQLconn');
const ProdSQL = new ClienteSQL(optionsSQL);

const ContMensajes = require('./contenedorMensajes');

const app = express();

const httpServer = new HttpServer(app);

const io = new IOServer(httpServer);

app.set ('view engine', 'ejs');

app.use(express.static('./public'));

app.get('/', async (req, res) => {
    res.render('index.ejs', {root: __dirname});
})

io.on('connection', async (sockets) => {

    sockets.emit('productos', await ProdSQL.listarProductos())

    console.log('Un cliente se ha conectado!: ' + sockets.id)

    sockets.emit('authors', await ContMensajes.getallAuthors())

    sockets.on('new-producto', async data => {

        await ProdSQL.insertarProductos(data)

        console.log(data)

        io.sockets.emit('productos', await ProdSQL.listarProductos())
    })

    sockets.on('new-author', async dato => {

        const author = dato.author

        const msg = dato.texto.text

        const email = dato.author.idMail

        await ContMensajes.createAuthor(author)
        await ContMensajes.insertMsgToAuthor(email , msg)

        // console.log(dato)

        io.sockets.emit('authors', await ContMensajes.getallAuthors())
        io.sockets.emit('msgs', await ContMensajes.getallAuthorMSGS())

    })
})

//-----------------------------------------------------------------------------------------------------------

const PORT = 8080
httpServer.listen(PORT, () => console.log('Iniciando en el puerto: ' + PORT))