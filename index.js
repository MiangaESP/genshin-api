require('dotenv').config()
require('./mongo')

const express = require('express')
const fileupload = require("express-fileupload");
const app = express()
const cors = require('cors')

const characterRouter = require('./controllers/characters')
const weaponRouter = require('./controllers/weapons');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');

app.use(express.json())
app.use(express.static('public'));
app.use(cors())
app.use(fileupload());

//Pagina de inicio
app.get('/', (request, response) => {
    response.send((
        "<h1>Genshin API</h1>" +
        "<h2>Elementos disponibles</h2>" +
        "<h3>/personajes</h3>" +
        "<ol>/armas, /armas/:tipo</ol>" +
        "<ol>/elemento, /elemento/:tipo</ol>" +
        "<ol>/rareza, /rereza/:tipo</ol>" +
        "<ol>/region, /region/:tipo</ol>" +
        "<ol>/random</ol>" +
        "<ol>/:nombre</ol>" +
        "<h3>/armas</h3>" +
        "<ol>/tipo, /tipo/:tipo</ol>" +
        "<ol>/rareza, /rareza/:tipo</ol>" +
        "<ol>/stat_secundario, /stat_secundario/:tipo</ol>" +
        "<ol>/random</ol>" +
        "<ol>/:nombre</ol>" +
        "<h3>/usuarios</h3>" +
        "<h3>/login</h3>"
    ))
})

app.use('/personajes', characterRouter)
app.use('/armas', weaponRouter)
app.use('/usuarios', usersRouter)
app.use('/login', loginRouter)

app.use((request, response, next) => {
    response.status(404).end()
})

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`)
})

module.exports = { app, server }