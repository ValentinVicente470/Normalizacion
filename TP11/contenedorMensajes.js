const admin = require ('firebase-admin');
const serviceAccount = require ("./Firebase/ecommerce-47458-firebase-adminsdk-6osjg-12532de339");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

class Contenedor{
    constructor(){
        this.db = db.collection('CHAT')
    }

    async getallAuthors(){
        try{
            const query = await this.db.get();
            let fileExist = query.docs;

            if(fileExist.length >= 0){
                let objs = fileExist.map(doc =>({
                    id: doc.id,
                    ...doc.data(),
                }))
                return objs
            }
            else{
                console.log("No hay autores")
            }
        }
        catch(err){
            console.log(`${err} Error en la funcion getallAuthors`)
        }
    }

    async getallAuthorMSGS(email){
        try{
            const query = await this.db.doc(email).collection('msgs').get();
            let fileExist = query.docs;

            if(fileExist.length >= 0){
                let objs = fileExist.map(doc =>({
                    id: doc.id,
                    ...doc.data(),
                }))
                return objs
            }
            else{
                console.log("No hay mensajes")
            }
        }
        catch(err){
            console.log(`${err} Error en la funcion getallAuthorsMSGS`)
        }
    }

    async createAuthor({idMail, nombre, apellido, edad, alias, avatar}){
        try{

            const newAuthor = {
                author:{ 

                    idMail, 
                    nombre, 
                    apellido, 
                    edad, 
                    alias, 
                    avatar 
                },
            }

            const doc = this.db.doc(idMail)
            const mensajeNuevo = await doc.create(newAuthor);

            return mensajeNuevo; 
            
        }
        catch(err){
            console.log(`${err} Error en la funcion createAuthor`);
        }
    }

    async insertMsgToAuthor(email, Msg){
        
        try{
            const objs = await this.getallAuthorMSGS(email);
            let newID = 1
            if(objs.length > 0){
                newID = objs[objs.length -1].id +1;
            }

            const newMSG = {
                id: newID,
                mensaje: Msg,
            }

            // const hecho = await this.db.doc(email).collection('MSGS').doc(newMSG.id.toString()).set(newMSG, {merge: true});
            const hecho = await this.db.doc(email).set({msgs: newMSG}, {merge: true});
            return hecho;
           
        }
        catch(err){
            console.log(`${err} Error en la funcion insertMsgToAuthor`)
        }
    }
}

const ContMsg = new Contenedor();

module.exports = ContMsg;