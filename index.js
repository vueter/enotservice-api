const path = require('path')
const Fastify = require('fastify')
const Autoload = require('fastify-autoload')
const Cors = require('fastify-cors')

const app = Fastify()


app.register(Cors, {
    origin: true
})

app.register(require('fastify-file-upload'))

app.register(require('fastify-static'), {
    root: path.join(__dirname, 'uploads'),
    prefix: '/uploads/', // optional: default '/'
})

app.register(Autoload, {
    dir: path.join(__dirname, 'plugins')
})

app.register(Autoload, {
    dir: path.join(__dirname, 'services')
})

app.listen(3000, (error, address) => {
    if(error) throw error
    console.log(`server listening at ${address}`)
})