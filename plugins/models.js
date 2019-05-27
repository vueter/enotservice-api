const fp = require('fastify-plugin')
const mongoose = require('mongoose')

const citiesSchema = new mongoose.Schema({
    name: String
})

const citiesModel = mongoose.model('Cities', citiesSchema)

const regionsSchema = new mongoose.Schema({
    name: String
})

const regionsModel = mongoose.model('Regions', regionsSchema)

const infoSchema = mongoose.Schema({
    info: Object
})

const infoModel = mongoose.model('Info', infoSchema)

const userSchema = mongoose.Schema({
    firstname: String,
    lastname: String,
    username: String,
    password: String,
    phonenumber: String,
    email: String
})

const usersModel = mongoose.model('Users', userSchema)

const plugin = (instance, _, next) => {

    instance.grud(citiesModel).install('/cities', instance, {
        body: {
            type: 'object',
            properties: {
                name: {
                    type: 'string'
                }
            },
            required: ['name']
        }
    }, '1.0.0')

    instance.grud(regionsModel).install('/regions', instance, {
        body: {
            type: 'object',
            properties: {
                name: {
                    type: 'string'
                }
            },
            required: ['name']
        }
    }, '1.0.0')

    instance.grud(infoModel).install('/info', instance, {}, '1.0.0')

    instance.grud(usersModel).install('/users', instance, {
        body: {
            type: 'object',
            properties: {
                firstname: {
                    type: 'string'
                },
                lastname: {
                    type: 'string'
                },
                username: {
                    type: 'string'
                },
                password: {
                    type: 'string'
                },
                phonenumber: {
                    type: 'string'
                },
                email: {
                    type: 'string'
                },
            },
            required: ['firstname', 'lastname', 'username', 'password', 'phonenumber']
        }
    }, '1.0.0')

    next()
}

mongoose.connect('mongodb://@localhost:27017/enotservice', { autoIndex: false, useNewUrlParser: true })

module.exports = fp(plugin, {
    decorators: {
        dbConnection: mongoose.connection
    }
})