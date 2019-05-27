const fp = require('fastify-plugin')


const Plugin = function(model){
    if(!(this instanceof Plugin)){
        return new Plugin(model)
    }
    this.model = model
}

Plugin.prototype.create = function(data, reply){
    const model = new this.model(data)
    model.save((error) => {
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

Plugin.prototype.update = function(id, data, reply){
    this.model.updateOne({'_id' : id}, data, (error) => {
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

Plugin.prototype.find = function(query, reply){
    if(reply === undefined){
        reply = query
        query = {}
    }
    this.model.find(query, (error, data) => {
        if(error){
            reply.callNotFound()
        }
        else{
            reply.send({
                statusCode: 200,
                error: 'Ok',
                message: 'Success',
                data: data
            })
        }
    })
}


Plugin.prototype.delete = function(id, reply){
    this.model.deleteOne({'_id' : id}, (error) => {
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

Plugin.prototype.install = function(path, instance, schema, version){
    if(schema === undefined){
        schema = {}
    }

    if(version === undefined){
        version = '1.0.0'
    }

    instance.get(path, { version: version }, (_, reply) => {
        this.find(reply)
    })

    instance.route({
        method: 'POST',
        url: path + '/create',
        schema: schema,
        version: version,
        handler: (request, reply) => {
            this.create(request.body, reply)
        }
    })

    instance.route({
        method: 'POST',
        url: path + '/:id/update',
        schema: schema,
        version: version,
        handler: (request, reply) => {
            this.update(request.params.id, request.body, reply)
        }
    })

    instance.delete(path + '/:id/delete', { version: version }, (request, reply) => {
        this.delete(request.params.id, reply)
    })
}

module.exports = fp((instance, _, next) => {
    instance.decorate('grud', (model) => {
        return new Plugin(model)
    })
    next()
})