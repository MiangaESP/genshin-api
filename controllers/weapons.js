const weaponRouter = require('express').Router()
const Weapon = require('../models/Weapon')
const { TOKEN } = process.env


//Muestra todos las armas
weaponRouter.get('/', async (request, response) => {
    const weapons = await Weapon.find({})
    response.json(weapons)
})

weaponRouter.get('/random', async (request, response) => {
    const weapons = await Weapon.find({})
    const randomWeapon = weapons[Math.floor(Math.random()*weapons.length)]
    response.json(randomWeapon)
})

//Muestra las armas segun su tipo
weaponRouter.get('/tipo', async (request, response) => {
    response.json(["arco", "catalizador", "espada", "lanza", "mandoble"])
})

weaponRouter.get('/tipo/:tipo', async (request, response) => {
    const tipo = request.params.tipo
    const weapons = await Weapon.find({ tipo: { $regex: tipo, $options: 'i' } }).exec()
    response.json(weapons)
})

//Muestra las armas segun su rareza
weaponRouter.get('/rareza', async (request, response) => {
    response.json(["4", "5"])
})

weaponRouter.get('/rareza/:tipo', async (request, response) => {
    const tipo = request.params.tipo
    const weapons = await Weapon.find({ rareza: tipo }).exec()
    response.json(weapons)
})

//Muestra las armas segun su stat secundario
weaponRouter.get('/stat_secundario', async (request, response) => {
    response.json(["ATQ%", "PhDMG", "ER%", "Crit DMG", "Crit Rate", "DEF%", "HP%", "EM"])
})

weaponRouter.get('/stat_secundario/:stat_secundario', async (request, response) => {
    const stat_secundario = request.params.stat_secundario
    const weapons = await Weapon.find({ stat_secundario: { $regex: stat_secundario, $options: 'i' } }).exec()
    response.json(weapons)
})

//Muestra el arma del nombre dado
weaponRouter.get('/:nombre', async (request, response) => {
    const nombre = request.params.nombre
    const weapons = await Weapon.find({ nombre: { $regex: nombre, $options: 'i' } }).exec()
    response.json(weapons)
})

//Crea una nueva arma
weaponRouter.post('/', async (request, response) => {
    const { nombre, tipo, rareza, stat_secundario, 
            descripcion, ataque_basico, efecto_pasivo, token } = request.body
    const newPath = "public/imagenes/armas/";

    if(token!==TOKEN){
        return response.status(401).json({
            error: 'No estas autorizado a crear un personaje'
        }).end()
    }

    const file = request.files.file;
    const fileName = file.name;
    //Miramos que todos los campos hayan sido rellenados
    if (!nombre || !tipo || !rareza || !stat_secundario 
        || !descripcion || !ataque_basico || !efecto_pasivo
        || !file || !fileName) {
        return response.status(400).json({
            error: 'Falta un elemento por rellenar'
        })
    }
    if(isNaN(ataque_basico)){
        return response.status(400).json({
            error: 'El ataque basico debe ser un valor numerico'
        })
    }
    if(fileName.split('.').at(-1)!== "png" 
    && fileName.split('.').at(-1)!== "jpg" && fileName.split('.').at(-1)!== "jpeg"){
        return response.status(400).json({
            error: 'Formato incorrecto de imagen'
        }).end()
    }

    file.mv(`${newPath}${fileName}`, (err) => {
        if (err) {
            return response.status(500).json({
                error: 'No se pudo guardar la imagen'
            }).end()
        }
    });

    //Creamos la nueva arma con los atributos proporcionados
    try {
        const newWeapon = new Weapon({
            nombre, tipo, rareza, stat_secundario, descripcion, ataque_basico, 
            img: `/imagenes/armas/${fileName}`, efecto_pasivo
        })
        //Guardamos el arma en la BBDD y la devolvemos en el response
        await newWeapon.save()
        response.json(newWeapon)
    } catch (error) {
        //Si la clave unica esta duplicada, devolvemos error
        if (error.name === "ValidationError" || error.name==="Character validation failed") {
            return response.status(400).json({
                error: 'Esta arma ya existe'
            }).end()
        }
        return response.status(400).send(error).end();
    }
})

//Boramos una arma dado un nombre
weaponRouter.delete('/', (request, response,next) => {
    const {nombre, token } = request.body
    if(token!==TOKEN){
        return response.status(401).json({
            error: 'No estas autorizado a crear un arma'
        }).end()
    }
    Weapon.findOneAndDelete({ nombre: nombre }).exec()
        .then(() => {
            response.status(204).end()
        })
        .catch(error => {
            next(error)
        })
})

module.exports = weaponRouter