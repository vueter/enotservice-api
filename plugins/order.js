const fp = require('fastify-plugin')

const OrderSchema = function(items){
    if(!(this instanceof OrderSchema)){
        return new OrderSchema(items)
    }
    this.items = items
    this.removes = []
}

OrderSchema.prototype.findFirst = function(items){
    for(const item of items){
        if(this.removes.indexOf(item._id) === -1){
            return item
        }
    }
    return null
}

OrderSchema.prototype.getPossibles = function(items, check, param){
    const possibles = []
    for(const item of items){
        if(item[param] === check[param]){
            possibles.push(item)
        }
    }
    return possibles
}

OrderSchema.prototype.remove = function(item){
    this.removes.push(item._id)
}

OrderSchema.prototype.convert = function(){
    var first = this.findFirst(this.items)
    var response = []
    while(first !== null){
        const orders = this.getPossibles(this.items, first, 'order')
        var firstOrder = this.findFirst(orders)
        var segments = []
        while(firstOrder !== null){
            var possibleOrders = this.getPossibles(orders, firstOrder, 'name')
            var schema = {
                name: firstOrder.name,
                kind: firstOrder.kind,
                items: []
            }
            possibleOrders.sort((a, b) => {
                return a.position - b.position
            })
            for(const order of possibleOrders){
                schema.items.push({
                    text: order.text,
                    icon: order.icon,
                    price: order.price,
                    discount: order.discount
                })
                this.remove(order)
            }
            segments.push(schema)
            firstOrder = this.findFirst(orders)
        }
        response.push({ title: first.order, body: segments })
        first = this.findFirst(this.items)
    }
    return response
}

module.exports = fp((instance, _, next) => {
    instance.decorate('SchemaManager', OrderSchema)
    next()
})