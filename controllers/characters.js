const characterRouter = require('express').Router()
const Character = require('../models/Character')
const { TOKEN } = process.env

//Muestra todos los personajes
characterRouter.get('/', async (request, response) => {
    const characters = await Character.find({})
    response.json(characters)
})

characterRouter.get('/random', async (request, response) => {
    const characters = await Character.find({})
    const randomCharacter = characters[Math.floor(Math.random() * characters.length)]
    response.json(randomCharacter)
})

//Muestra los personajes segun su arma
characterRouter.get('/armas', async (request, response) => {
    response.json(["arco", "catalizador", "espada", "lanza", "mandoble"])
})

characterRouter.get('/armas/:tipo', async (request, response) => {
    const tipo = request.params.tipo
    const characters = await Character.find({ arma: { $regex: tipo, $options: 'i' } }).exec()
    response.json(characters)
})

//Muestra los personajes segun su elemento
characterRouter.get('/elemento', async (request, response) => {
    response.json(["pyro", "hydro", "electro", "cryo", "anemo", "geo"])
})

characterRouter.get('/elemento/:tipo', async (request, response) => {
    const tipo = request.params.tipo
    const characters = await Character.find({ elemento: { $regex: tipo, $options: 'i' } }).exec()
    response.json(characters)
})

//Muestra los personajes segun su rareza
characterRouter.get('/rareza', async (request, response) => {
    response.json(["4", "5"])
})

characterRouter.get('/rareza/:tipo', async (request, response) => {
    const tipo = request.params.tipo
    const characters = await Character.find({ rareza: tipo }).exec()
    response.json(characters)
})

//Muestra los personajes segun su region
characterRouter.get('/region', async (request, response) => {
    response.json(["mondstat", "liyue", "inazuma"])
})

characterRouter.get('/region/:tipo', async (request, response) => {
    const tipo = request.params.tipo
    const characters = await Character.find({ region: { $regex: tipo, $options: 'i' } }).exec()
    response.json(characters)
})

//Muestra el personaje del nombre dado
characterRouter.get('/:nombre', async (request, response) => {
    const nombre = request.params.nombre
    const characters = await Character.find({ nombre: { $regex: nombre, $options: 'i' } }).exec()
    response.json(characters)
})

//Crea un nuevo personaje
characterRouter.post('/', async (request, response) => {
    const { nombre, arma, rareza, elemento,
        descripcion, region, habilidad1, descripcion1,
        habilidad2, descripcion2, habilidad3, descripcion3, token } = request.body
    const newPath = "public/imagenes/personajes/";
    if (token !== TOKEN) {
        return response.status(401).json({
            error: 'No estas autorizado a crear un personaje'
        }).end()
    }
    if (request.files === null) {
        return response.status(400).json({
            error: 'Ha habido un error al recibir la imagen'
        }).end()
    }

    const file = request.files.file;
    const fileName = file.name;
    const habilidades = [{
        "nombre": habilidad1,
        "descripcion": descripcion1
    },
    {
        "nombre": habilidad2,
        "descripcion": descripcion2
    },
    {
        "nombre": habilidad3,
        "descripcion": descripcion3
    }]

    //Miramos que todos los campos hayan sido rellenados
    if (!nombre || !arma || !rareza || !elemento || !descripcion || !region || !file || !fileName || !habilidades) {
        return response.status(400).json({
            error: 'Falta un elemento por rellenar'
        }).end()
    }
    console.log(fileName)
    try {
        
        if (fileName.split('.').at(-1) !== "png"
            && fileName.split('.').at(-1) !== "jpg" && fileName.split('.').at(-1) !== "jpeg") {
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
    } catch (error) {
        return response.status(400).json({
            error: 'Ha habido un problema a la hora de procesar la imagen'
        }).end()
    }


    //Creamos el nuevo personajes con los atributos proporcionados
    try {
        const newCharacter = new Character({
            nombre, arma, rareza, elemento, descripcion, region, img: `/imagenes/personajes/${fileName}`, habilidades
        })
        //Guardamos los personajes en la BBDD y lo devolvemos
        await newCharacter.save()
        response.json(newCharacter)
    } catch (error) {
        //Si la clave unica esta duplicada, devolvemos error
        if (error.name === "ValidationError" || error.name === "Character validation failed") {
            return response.status(400).json({
                error: 'Este personaje ya existe'
            }).end()
        }
        return response.status(400).send(error).end();
    }
})

characterRouter.delete('/', (request, response) => {
    const { nombre, token } = request.body
    if (token !== TOKEN) {
        return response.status(401).json({
            error: 'No estas autorizado a crear un personaje'
        }).end()
    }
    Character.findOneAndDelete({ nombre: nombre }).exec()
        .then(() => {
            response.status(204).end()
        })
        .catch(error => {
            next(error)
        })
})

module.exports = characterRouter