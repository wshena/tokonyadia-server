const express = require('express');
const router = express.Router();

const { getProducts } = require('../controllers/productController');
const { getCategories } = require('../controllers/categoryController');
const { getCollections } = require('../controllers/collectionController');
const { createNewOrder, allOrders, processOrder, cancelOrder } = require('../controllers/orderController');

// Route untuk produk
router.get('/products', getProducts);

// Route untuk kategori
router.get('/categories', getCategories);

// Route untuk koleksi
router.get('/collections', getCollections);

// Route untuk order
router.get('/orders', allOrders)
router.post('/order', createNewOrder)
router.post('/order/process', processOrder);
router.post('/order/cancel', cancelOrder);

module.exports = router;
