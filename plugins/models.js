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
    name: String,
    value: String
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

const ordersSchema = mongoose.Schema({
    user: String,
    city: String,
    region: String,
    street: String,
    home: Number,
    tier: Number,
    accommodation: Number,
    segments: Array
})

const ordersModel = mongoose.model('Orders', ordersSchema)

const orderSchema = mongoose.Schema({
    segments: Array
})

const orderModel = mongoose.model('Order', orderSchema)

const orderGroupsSchema = mongoose.Schema({
    name: String
})

const sliderSchema = mongoose.Schema({
    name: String,
    path: String
})

const sliderModel = mongoose.model('Slider', sliderSchema)

const orderElementsSchema = mongoose.Schema({
    order: String,
    name: String,
    icon: String,
    price: Number,
    kind: String,
    text: String,
    discount: Number,
    position: Number
})

const orderGroupsModel = mongoose.model('OrderGroups', orderGroupsSchema)
const orderElementsModel = mongoose.model('OrderElements', orderElementsSchema)

const requestSchema = mongoose.Schema({
    text: String
})

const requestModel = mongoose.model('Requests', requestSchema)

const smsModel = mongoose.model('SMS', new mongoose.Schema({
    phonenumber: String,
    smscode: Number
}))

const plugin = (instance, _, next) => {
    instance.decorate('SMS', smsModel)

    instance.grud(smsModel).install('/sms', instance, {
        body: {
            type: 'object',
            properties: {
                phonenumber: { type: 'string' },
                smscode: { type: 'number' }
            }
        }
    }, '1.0.0')

    instance.grud(requestModel).install('/requests', instance, {
        body: {
            type: 'object',
            properties: {
                text: { type: 'string' }
            }
        }
    }, '1.0.0')

    instance.grud(sliderModel).install('/slider', instance, {
        body: {
            type: 'object',
            properties: {
                name: { type: 'string' },
                path: { type: 'string' }
            },
            required: ['name', 'path']
        }
    }, '1.0.0')

    instance.grud(orderGroupsModel).install('/order-groups', instance, {
        body: {
            type: 'object',
            properties: {
                name: {
                    type: 'string'
                }
            }
        }
    }, '1.0.0')

    instance.decorate('Schema', orderElementsModel)

    instance.grud(orderElementsModel).install('/order-elements', instance, {
        body: {
            type: 'object',
            properties: {
                order: { type: 'string' },
                name: { type: 'string' },
                icon: { type: 'string' },
                price: { type: 'string' },
                kind: { type: 'string' },
            }
        }
    }, '1.0.0')

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

    instance.decorate('Users', usersModel)
    instance.grud(usersModel).install('/users', instance, {
        body: {
            type: 'object',
            properties: {
                firstname: { type: 'string' },
                lastname: { type: 'string' },
                username: { type: 'string' },
                password: { type: 'string' },
                phonenumber: { type: 'string' },
                email: { type: 'string' },
            },
            required: ['firstname', 'lastname', 'username', 'password', 'phonenumber']
        }
    }, '1.0.0')

    instance.grud(ordersModel).install('/orders', instance, {
        type: 'object',
        properties: {
            user: { type: 'string' },
            city: { type: 'string' },
            region: { type: 'string' },
            street: { type: 'string' },
            home: { type: 'number' },
            tier: { type: 'number' },
            accommodation: { type: 'string' },
            segments: { type: 'array' }
        },
        required: ['user', 'city', 'region', 'street', 'home', 'tier', 'accommodation', 'segments']
    }, '1.0.0')

    instance.grud(orderModel).install('/order', instance, {
        type: 'object',
        properties: {
            segments: { type: 'array' }
        },
        required: ['segments']
    }, '1.0.0')

    next()
}

mongoose.connect('mongodb://localhost:27017/enotservice', { autoIndex: false, useNewUrlParser: true })

module.exports = fp(plugin, {
    decorators: {
        dbConnection: mongoose.connection
    }
})