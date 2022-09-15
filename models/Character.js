const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const { model, Schema } = mongoose

const characterSchema = new Schema({
    nombre: { type: String, unique: true },
    arma: String,
    rareza: Number,
    elemento: String,
    descripcion: String,
    region: String,
    img: String,
    habilidades: [
        {
            nombre: String,
            descripcion: String
        },
        {
            nombre: String,
            descripcion: String
        },
        {
            nombre: String,
            descripcion: String
        }
    ]

})

characterSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        delete returnedObject._id
        delete returnedObject.__v
        returnedObject.habilidades.forEach(habilidad => delete habilidad._id)
    }
})

characterSchema.plugin(uniqueValidator)

const Character = model('Character', characterSchema)

module.exports = Character