const express = require('express');
const router = express.Router();
const shopController = require('../controller/shop-controller');
const db = require('../data/database');

router.get('/', shopController.getHome);
router.get('/products', shopController.fetchAllProductData);
router.get('/admin/add-products', shopController.getAdminProducts);
router.post('/admin/add-products', shopController.addProduct);
router.delete('/admin/delete-product', shopController.deleteProduct);
router.get('/admin/:id/edit', shopController.getEditProduct);
router.post('/admin-edit', shopController.patchEditProduct);
router.get('/admin/orders-overview', shopController.getAdminOrderOverview);
router.get('/admin/order/:id/details', shopController.getAdminOrderDetails);
router.get('/cart', shopController.getCart);
router.post('/cart', shopController.postCart);
router.get('/product/:id/details', shopController.fetchProductDetails);
router.delete('/removecartitem', shopController.removeCartItem);
router.get('/order-placed', shopController.getOrderPlaced);
router.post('/order-placed', shopController.postOrderPlaced);
router.get('/order-history', shopController.getOrderHistory);

module.exports = router;
