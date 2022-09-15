const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const { model, Schema } = mongoose

const weaponSchema = new Schema({
    nombre: { type: String, unique: true },
    tipo: String,
    rareza: Number,
    stat_secundario: String,
    descripcion: String,
    ataque_basico: String,
    img: String,
    efecto_pasivo: String

})

weaponSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        delete returnedObject._id
        delete returnedObject.__v
    }
})

weaponSchema.plugin(uniqueValidator)

const Weapon = model('Weapon', weaponSchema)

module.exports = Weapon