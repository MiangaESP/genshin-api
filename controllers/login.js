const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/User')
const { TOKEN } = process.env

loginRouter.post('/', async (request, response) => {
    console.log("Intentando loguearse")
    const { body } = request
    const { username, password, token } = body
    console.log("Username: ",username)
    console.log("Password: ",password)
    console.log("Token: ",token)
    if(token!==TOKEN){
        return response.status(401).json({
            error: 'No estas autorizado a loguear un usuario'
        }).end()
    }

    const user = await User.findOne({ username })
    const passwordCorrect = user === null ? false : await bcrypt.compare(password, user.passwordHash)

    if (!user || !passwordCorrect) {
        response.status(401).json({
            error: 'Usuario o contraseña incorrectos'
        })
    }else{
        response.send({
            username: user.username,
            canCreate: user.canCreate
        })
    }  
})

module.exports = loginRouter