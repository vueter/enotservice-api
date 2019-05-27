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
    next()
}