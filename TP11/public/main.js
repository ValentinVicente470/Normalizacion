const sockets = io.connect()

//--------PRODUCTOS------------------------------------------------------------------------

function addProducto(a) {

    const producto = {
        name: document.getElementById ("name").value,
        description: document.getElementById ("description").value,
        code: document.getElementById ("code").value,
        price: document.getElementById ("price").value,
        thumbnail: document.getElementById ("thumbnail").value,
    }

    sockets.emit ('new-producto', producto)

    return false
}

function render (data) {
    
    const html = data.map ((elem, index) => {

        return (`<tr>
        <td>${elem.name}</td>
        <td>${elem.description}</td>
        <td>${elem.code}</td>
        <td>${elem.price}</td>
        <td> <img src="${elem.thumbnail}" height="50px"> </img> </td>
        <td>${elem.id}</td> </tr>`)

    }).join(' ')

    document.getElementById("productos").innerHTML = html
}

sockets.on('productos', function(data) {render(data)})


//--------CHAT------------------------------------------------------------------------------

function addMessage(o) {

    const author = {

    
        idMail: document.getElementById("mail").value,
        nombre: document.getElementById("nombre").value,
        apellido: document.getElementById("apellido").value,
        edad: document.getElementById("edad").value,
        alias: document.getElementById("alias").value,
        avatar: document.getElementById("avatar").value,
    
    }

    const texto = {

        text: document.getElementById("text").value

    }

    const Blog = { author, texto }

    sockets.emit("new-author", Blog);

    return false
}

function renders(dato) {

    const html1 = dato.map((element, index) => {  

        return(`
        <div>
            <div class="Cont_todo">
                <strong>${element.author.idMail}</strong>
                <em class="Usuario_mensj">${element.text}</em>
            </div>
        </div>`)

    }).join(' ')

    document.getElementById("messages").innerHTML = html1
}

sockets.on('authors', function(dato) {renders(dato)})
sockets.on('msgs', function(dato) {renders(dato)})

























