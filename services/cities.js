
module.exports = (instance, _, next) => {
    instance.get('/cities', { version: '1.0.0' }, (_, reply) => {
        instance.grud(instance.Cities).find(reply)
    })

    instance.route({
        method: 'POST',
        url: '/cities/create',
        schema: {
            body: {
                type: 'object',
                properties: {
                    name: {
                        type: 'string'
                    }
                },
                required: ['name']
            }
        },
        version: '1.0.0',
        handler: (request, reply) => {
            instance.grud(instance.Cities).create({ name: request.body.name }, reply)
        }
    })

    instance.route({
        method: 'POST',
        url: '/cities/:id/update',
        schema: {
            body: {
                type: 'object',
                properties: {
                    name: {
                        type: 'string'
                    }
                },
                required: ['name']
            }
        },
        version: '1.0.0',
        handler: (request, reply) => {
            instance.grud(instance.Cities).update(request.params.id, request.body, reply)
        }
    })

    instance.delete('/cities/:id/delete', { version: '1.0.0' }, (request, reply) => {
        instance.grud(instance.Cities).delete(request.params.id, reply)
    })

    next()
}