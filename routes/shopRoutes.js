const express = require('express')
const shopController = require('../controllers/shopController');
const verifyJWT = require('../middlewares/verifyJWT')

const router = express.Router()

router.route('/')
    .get(shopController.getIndex)

router.use(verifyJWT)

router.route('/cart')
    .get(shopController.getCart)
    .delete(shopController.clearCart)

router.route('/cart/:productId')
    .get(shopController.addToCart)
    .put(shopController.removeFromCart)
    

module.exports = router