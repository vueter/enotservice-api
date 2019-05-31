const fs = require('fs')


module.exports = (instance, _, next) => {
    instance.get('/', (_, reply) => {
        reply.send({ root: true })
    })

    instance.post('/upload', (request, reply) => {
        const files = request.raw.files
        if(files['image']){
            const image = files['image']
            var wstream = fs.createWriteStream('./uploads/' + image.md5 + image.name);
            wstream.write(image.data)
            wstream.end()
            reply.send({
                statusCode: 200,
                error: 'Ok',
                message: 'Success',
                path: image.md5 + image.name
            })
        }
        else{
            reply.callNotFound()
        }
    })

    const loginSchema = {
        schema: {
            body: {
                type: 'object',
                properties: {
                    username: { type: 'string' },
                    password: { type: 'string' }
                },
                required: ['username', 'password']
            },
        },
        version: '1.0.0'
    }
    instance.post('/login', loginSchema, (request, reply) => {
        const username = request.body['username']
        const password = request.body['password']
        instance.Users.findOne({ username: username, password: password }, (error, user) => {
            if(error){
                reply.send({
                    statusCode: 299,
                    error: 'Invlid error',
                    message: 'Error in reading data'
                })
            }
            else{
                if(user){
                    reply.send({
                        statusCode: 200,
                        error: 'Ok',
                        message: 'Success',
                        data: user
                    })
                }
                else{
                    reply.send({
                        statusCode: 298,
                        error: 'Not found user',
                        message: 'User could not founded'
                    })
                }
            }
        })
    })

    const registerSchema = {
        schema: {
            body: {
                type: 'object',
                properties: {
                    username: { type: 'string' },
                    password: { type: 'string' },
                    firstname: { type: 'string' },
                    lastname: { type: 'string' },
                    email: { type: 'string' },
                    phonenumber: { type: 'string' }
                },
                required: ['username', 'password', 'firstname', 'lastname', 'phonenumber']
            },
        },
        version: '1.0.0'
    }

    instance.post('/register', registerSchema, (request, reply) => {
        const username = request.body['username']
        const password = request.body['password']
        instance.Users.findOne({ username: username, password: password }, (error, user) => {
            if(error){
                reply.callNotFound()
            }
            else{
                if(user){
                    reply.send({
                        statusCode: 200,
                        error: 'Ok',
                        message: 'Success'
                    })
                }
                else{
                    const User = new instance.Users(request.body)
                    User.save((error) => {
                        if(error){
                            reply.callNotFound()
                        }
                        else{
                            reply.send({
                                statusCode: 200,
                                error: 'Ok',
                                message: 'Success'
                            })
                        }
                    })
                }
            }
        })
    })

    instance.post('/admin/login', { schema: { type: 'object', properties: { username: { type: 'string' }, password: { type: 'string' } } },  version: '1.0.0' },(request, reply) => {
        const username = request.body['username']
        const password = request.body['password']
        if(['admin admin'].indexOf(username + ' ' + password) !== -1){
            reply.send({
                statusCode: 200,
                error: 'Ok',
                message: 'Success'
            })
        }
        else{
            reply.callNotFound()
        }
    })

    instance.post('/verify', { schema: { type: 'object', properties: { phonenumber: { type: 'string' } } }, version: '1.0.0' }, (request, reply) => {
        const phonenumber = request.body['phonenumber']
        instance.SMS.findOne({ phonenumber: phonenumber }, (error, item) => {
            if(error){
                reply.callNotFound()
            }
            else{
                if(item){
                    reply.send({ statusCode: 200, error: 'Ok', message: 'Success' })
                }
                else{
                    const model = new instance.SMS({ phonenumber: phonenumber, smscode: 100 })
                    model.save(error => {
                        if(error){
                            reply.callNotFound()
                        }
                        else{
                            reply.send({ statusCode: 200, error: 'Ok', message: 'Success' })
                        }
                    })
                }
            }
        })
    })

    const verifyCodeSchema = {
        schema: {
            body: {
                type: 'object',
                properties: {
                    phonenumber: { type: 'string' },
                    smscode: { type: 'number' }
                }
            }
        },
        version: '1.0.0'
    }
    instance.post('/verify/code', verifyCodeSchema, (request, reply) => {
        const phonenumber = request.body['phonenumber']
        const smscode = request.body['smscode']
        instance.SMS.findOne({ phonenumber: phonenumber, smscode: smscode }, (error, item) => {
            if(error){
                reply.callNotFound()
            }
            else{
                if(item){
                    reply.send({ statusCode: 200, error: 'Ok', message: 'Success' })
                }
                else{
                    reply.send({ statusCode: 200, error: 'Error', message: 'Incorrect sms code' })
                }
            }
        })
    })

    instance.get('/schema', { version: '1.0.0' }, (_, reply) => {
        instance.Schema.find((error, items) => {
            if(error){
                reply.callNotFound()
            }
            else{
                const manager = new instance.SchemaManager(items)
                reply.send({
                    statusCode: 200,
                    error: 'Ok',
                    message: 'Success',
                    data: manager.convert()
                })
            }
        })
    })

    instance.get('/payment-schema', { version: '1.0.0' }, (_, reply) => {
        instance.PaymentSchema.find((error, items) => {
            if(error){
                reply.callNotFound()
            }
            else{
                const manager = new instance.SchemaManager(items)
                reply.send({
                    statusCode: 200,
                    error: 'Ok',
                    message: 'Success',
                    data: manager.convert()
                })
            }
        })
    })

    const schema = {
        type: 'object',
        properties: {
            phonenumber: {
                type: 'string'
            },
            price: {
                type: 'number'
            }
        },
        required: ['phonenumber', 'price']
    }
    instance.post('/pay', { schema, version: '1.0.0' }, (request, reply) => {
        reply.send({
            statusCode: 200,
            error: 'Ok',
            message: 'Success',
            data: request.body
        })
    })

    next()
}