const ProductsClass = require('../models/products-model');
const CartClass = require('../models/cart-model');
const OrderClass = require('../models/order-model');
const ObjectId = require('mongodb').ObjectId;
const formUtil = require('../util/auth-util');

function getOrderPlaced(req, res) {
  res.render('order-placed');
}

async function postOrderPlaced(req, res) {
  const checkoutValidation = await formUtil.validateCheckoutForm(req);

  if (checkoutValidation) {
    await new OrderClass(
      req.body.email,
      req.body.title,
      req.body.name,
      req.body.surname,
      req.body['address-street'],
      req.body['address-street-number'],
      req.body['address-areacode'],
      req.body['address-city'],
      req.body['address-country'],
      req.body['payment-methods'],
      req.body['paypal-email'],
      req.body['card-holder'],
      req.body['card-number'],
      req.body.cvc,
      req.session.cartData
    ).insertOrder();
    req.session.cartData = [];
    req.session.errorMessage = '';
    req.session.save(function () {
      res.redirect('/order-placed');
    });
    return;
  }
  res.redirect('/cart');
}

function getHome(req, res) {
  res.render('home', { docTitle: 'Home Page' });
}

async function getCart(req, res) {
  await CartClass.resetCartData(req);
  await CartClass.mergeCartItemQty(req);
  await CartClass.cartItemTotalPrice(req);

  const liIndex = 0;
  res.render('cart', { cartItems: req.session.cartData, liIndex: liIndex });
}

async function postCart(req, res) {
  await CartClass.resetCartData(req);
  await CartClass.postCart(req);
  res.json({ message: 'Success!' });
}

async function removeCartItem(req, res) {
  await CartClass.removeCartItem(req, JSON.parse(req.body.deletedItemIndex));
  res.json({ message: 'Success!' });
}

async function fetchAllProductData(req, res) {
  req.session.errorMessage = '';
  const allProductData = await ProductsClass.getAllProductData();
  res.render('products', { allProductData: allProductData });
}

async function fetchProductDetails(req, res) {
  const productDetails = await ProductsClass.getProductDetails(
    new ObjectId(req.params.id)
  );
  res.render('product-details', { productDetails: productDetails });
}

async function getAdminProducts(req, res) {
  if (res.locals.isAdmin) {
    res.render('./admin/admin-add-products');
  } else {
    res.render('403');
  }
  return;
}

async function deleteProduct(req, res) {
  await ProductsClass.removeProduct(ObjectId(req.body.objectId));
  res.json('Success');
}

async function addProduct(req, res) {
  const productData = JSON.parse(req.body['product-data']);
  const filePath = req.file.path.substring(6).replace(/\\/g, '/');
  await new ProductsClass(
    productData['product-title'],
    productData['product-summary'],
    filePath,
    Number(productData['product-price'])
  ).postNewProduct();
  res.json({ message: 'Success!' });
}

async function getEditProduct(req, res) {
  if (res.locals.isAdmin) {
    const productDetails = await ProductsClass.getProductDetails(
      new ObjectId(req.params.id)
    );
    res.render('./admin/admin-edit-product', {
      productDetails: productDetails,
    });
  } else {
    res.render('403');
  }
}

async function patchEditProduct(req, res) {
  if (req.file) {
    const filePath = await req.file.path.substring(6).replace(/\\/g, '/');
    await new ProductsClass(
      req.body.title,
      req.body.summary,
      filePath,
      req.body.price
    ).updateOneProduct(ObjectId(req.body.objectId));
    res.redirect('/admin');
    return;
  }
  await new ProductsClass(
    req.body.title,
    req.body.summary,
    req.body.imagePath,
    req.body.price
  ).updateOneProduct(ObjectId(req.body.objectId));
  res.redirect('/admin');
  return;
}

async function getAdminOrderOverview(req, res) {
  const ordersOverview = await OrderClass.getAllOrders();
  res.render('./admin/admin-orders-overview', {
    ordersOverview: ordersOverview,
  });
}

async function getAdminOrderDetails(req, res) {
  const fetchOrderById = await OrderClass.getOrderById(ObjectId(req.params.id));
  res.render('./admin/admin-order-details', { fetchOrderById: fetchOrderById });
}

async function getOrderHistory(req, res) {
  if (res.locals.isAuth) {
    const fetchOrders = await OrderClass.getOrder(res.locals.loggedInEmail);
    res.render('order-history', { fetchOrders: fetchOrders });
    return;
  }
  res.render('403');
  return;
}

module.exports = {
  getHome: getHome,
  fetchAllProductData: fetchAllProductData,
  addProduct: addProduct,
  deleteProduct: deleteProduct,
  getEditProduct: getEditProduct,
  patchEditProduct: patchEditProduct,
  getAdminProducts: getAdminProducts,
  getCart: getCart,
  postCart: postCart,
  fetchProductDetails: fetchProductDetails,
  removeCartItem: removeCartItem,
  getOrderPlaced: getOrderPlaced,
  postOrderPlaced: postOrderPlaced,
  getAdminOrderOverview: getAdminOrderOverview,
  getAdminOrderDetails: getAdminOrderDetails,
  getOrderHistory: getOrderHistory,
};
