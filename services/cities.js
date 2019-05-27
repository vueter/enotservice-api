
module.exports = (instance, _, next) => {

    instance.grud(instance.Cities).install(instance, {
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

    next()
}