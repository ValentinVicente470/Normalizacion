const Contenedor = require('../controllers/contenedorMensajes.js')

const { normalize, denormalize, schema } = require('normalizr')

const util = require('util')

const schemaAuthor = new schema.Entity('author', {}, { idAttribute: 'id' })

const schemaMensaje = new schema.Entity('mensaje', { author: schemaAuthor }, { idAttribute: 'id' })

const schemaMensajes = new schema.Entity('mensajes', { mensajes: [schemaMensaje] }, { idAttribute: 'id' })

const normalizarArray = (messagesWithId) => normalize(messagesWithId, schemaMensajes)

function print(objecto) {
    console.log(util.inspect(objecto, false, 12, true));
}


class norm {
    async denormalizedList(mensajesNormalizados) {
       console.log(await mensajesNormalizados)
       let listLength = JSON.stringify(mensajesNormalizados).length
       console.log(listLength)
   
       let listDenormalize = denormalize(mensajesNormalizados.result, schemaMensajes, mensajesNormalizados.entities)
       let listDenormalizeSize = JSON.stringify(listDenormalize).length
       console.log(listDenormalizeSize)
   
       let percent = parseInt((listDenormalizeSize * 100) / listLength)
   
       console.log(`Porcentaje de compresion del ${percent}%`)
   
       return print(listDenormalize)
   }

   
    async normalizedList() {
        const arrayMensajes = await Contenedor.getMSGS()
        const normalizedArray = normalizarArray({ id: 'mensajes', arrayMensajes })
        const resp = print(normalizedArray)
        return normalizedArray
    }
    
}

const norms = new norm()
module.exports = norms