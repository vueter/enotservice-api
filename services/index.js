
module.exports = (instance, _, next) => {
    instance.get('/', (_, reply) => {
        reply.send({ root: true })
    })
    next()
}