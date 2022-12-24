const express = require('express')
const favorateController = require('../controllers/favorateController');
const verifyJWT = require('../middlewares/verifyJWT')

const router = express.Router()

router.route('/')
    .get(verifyJWT, favorateController.getFavorates)

router.route('/:productId')
    .post(verifyJWT, favorateController.postFavorate)
    

module.exports = router