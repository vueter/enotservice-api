const fp = require('fastify-plugin')
const mongoose = require('mongoose')

const citiesSchema = new mongoose.Schema({
    name: String
})

const citiesModel = mongoose.model('Cities', citiesSchema)

module.exports = fp((instance, _, next) => {
    mongoose.connect('mongodb://@localhost:27017/enotservice', { autoIndex: false, useNewUrlParser: true })
    instance.decorate('dbConnection', mongoose.connection)
    instance.decorate('Cities', citiesModel)
    next()
})