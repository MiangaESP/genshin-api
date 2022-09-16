const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/User')
const { TOKEN } = process.env


usersRouter.get('/', async (request, response) => {
    const users = await User.find({})
    response.json(users)
})

usersRouter.post('/', async (request, response) => {
    try {
        const { body } = request
        const { username, password, token } = body
        console.log("Username: ", username)
        console.log("Password: ", password)
        console.log("Token: ", token)
        if (token !== TOKEN) {
            return response.status(401).json({
                error: 'No estas autorizado a crear un personaje'
            }).end()
        }
        const passwordHash = await bcrypt.hash(password, 10)
        const user = new User({
            username,
            passwordHash,
            canCreate: false
        })

        const savedUser = await user.save()

        response.status(201).json(savedUser)
    } catch (error) {
        if (error.name === "ValidationError" || error.name === "Character validation failed") {
            return response.status(400).json({
                error: 'Ya existe un usuario con este nombre'
            }).end()
        }
    }

})

module.exports = usersRouter