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

module.exports = fp((instance, _, next) => {
    instance.decorate('grud', (model) => {
        return new Plugin(model)
    })
    next()
})