class Cart {
  static postCart(req) {
    const addItemData = {
      quantity: req.body.quantity,
      title: req.body.title,
      price: req.body.price,
      imagePath: req.body.imagePath,
      totalPrice: req.body.quantity * req.body.price,
    };
    req.session.cartData.push(addItemData);
    return;
  }

  static resetCartData(req) {
    if (!req.session.cartData) {
      req.session.cartData = [];
    }
    return;
  }

  static mergeCartItemQty(req) {
    for (let i = 0; i < req.session.cartData.length; i++) {
      for (let n = 0; n < req.session.cartData.length; n++) {
        if (i === n) {
          n++;
        }
        if (n < req.session.cartData.length) {
          const checkMatchingCartItems =
            req.session.cartData[i].title === req.session.cartData[n].title;
          if (checkMatchingCartItems) {
            req.session.cartData[i].quantity =
              Number(req.session.cartData[i].quantity) +
              Number(req.session.cartData[n].quantity);
            req.session.cartData.splice(n, 1);
          }
        }
      }
    }
    return;
  }

  static cartItemTotalPrice(req) {
    for (let i = 0; i < req.session.cartData.length; i++) {
      req.session.cartData[i].totalPrice =
        req.session.cartData[i].price * req.session.cartData[i].quantity;
    }
    return;
  }

  static removeCartItem(req, index) {
    req.session.cartData.splice(Number(index), 1);
  }
}

module.exports = Cart;
