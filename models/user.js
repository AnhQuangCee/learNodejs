const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cart: {
        items: [
            {
                productId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true
                }
            }
        ]
    },
})

userSchema.methods.addToCart = function (product) {
    const cartProductIndex = this.cart.items.findIndex(cp => {
        return cp.productId.toString() === product._id.toString()
    })
    let newQuatity = 1
    const updateCartItems = [...this.cart.items]

    if (cartProductIndex >= 0) {
        newQuatity = this.cart.items[cartProductIndex].quantity + 1
        updateCartItems[cartProductIndex].quantity = newQuatity
    } else {
        updateCartItems.push({
            productId: product._id,
            quantity: newQuatity
        })
    }

    const updateCart = { items: updateCartItems }
    this.cart = updateCart
    return this.save()
}

// Delete Cart Items
userSchema.methods.removeFromCart = function (productId) {
    const updateCartItems = this.cart.items.filter(item => {
        return item.productId.toString() !== productId.toString()
    })
    const updateCart = { items: updateCartItems }
    this.cart = updateCart
    return this.save()
}

module.exports = mongoose.model('User', userSchema)

// const getDb = require('../util/database').getDb
// const mongodb = require('mongodb')
// const { get } = require('../routes/shop')

// const { ObjectId } = mongodb

// class User {
//     constructor(username, email, cart, id) {
//         this.username = username
//         this.email = email
//         this.cart = cart
//         this._id = id
//     }

//     save() {
//         const db = getDb()
//         return db
//             .collection('users')
//             .insertOne(this)
//             .then((user) => {
//                 return user
//             })
//             .catch(err => console.log(err))
//     }

//     addToCart(product) {
//         const cartProductIndex = this.cart.items.findIndex(cp => {
//             return cp.productId.toString() === product._id.toString()
//         })
//         let newQuatity = 1
//         const updateCartItems = [...this.cart.items]

//         if (cartProductIndex >= 0) {
//             newQuatity = this.cart.items[cartProductIndex].quantity + 1
//             updateCartItems[cartProductIndex].quantity = newQuatity
//         } else {
//             updateCartItems.push({ productId: new ObjectId(product._id), quantity: newQuatity })
//         }

//         const updateCart = { items: updateCartItems }
//         const db = getDb()
//         return db
//             .collection('users')
//             .updateOne(
//                 { _id: new ObjectId(this._id) },
//                 { $set: { cart: updateCart } }
//             )
//     }

//     getCart() {
//         const db = getDb()
//         const productIds = this.cart.items.map(i => {
//             return i.productId
//         })
//         return db
//             .collection('products')
//             .find({ _id: { $in: productIds } })
//             .toArray()
//             .then(products => {
//                 return products.map(p => {
//                     return {
//                         ...p,
//                         quantity: this.cart.items.find(i => {
//                             return i.productId.toString() === p._id.toString()
//                         }).quantity
//                     }
//                 })
//             })
//             .catch(err => console.log(err))
//     }

//     // Delete Items from Cart
//     deleteItemFromCart(productId) {
//         const updateCartItems = this.cart.items.filter(item => {
//             return item.productId.toString() !== productId.toString()
//         })
//         const db = getDb()
//         return db
//             .collection('users')
//             .updateOne(
//                 { _id: new ObjectId(this._id) },
//                 { $set: { cart: { items: updateCartItems } } }
//             )
//     }

//     // Add Order
//     addOrder() {
//         const db = getDb()
//         return this.getCart().then(products => {
//             const order = {
//                 items: products,
//                 user: {
//                     _id: new ObjectId(this._id),
//                     name: this.username,
//                 }
//             }
//             return db
//                 .collection('orders')
//                 .insertOne(order)
//         }).then(result => {
//             return db
//                 .collection('users')
//                 .updateOne(
//                     { _id: new ObjekctId(this._id) },
//                     { $set: { cart: { items: [] } } }
//                 )
//         })


//     }

//     getOrder() {
//         const db = getDb()
//         return db
//             .collection('orders')
//             .find({ 'user._id': new ObjectId(this._id) })
//             .toArray()
//     }
//     static findById(userId) {
//         const db = getDb()
//         return db
//             .collection('users')
//             .findOne({ _id: new ObjectId(userId) })
//     }
// }

// module.exports = User