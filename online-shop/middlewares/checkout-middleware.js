function errorMessage(req, res, next) {
  if (req.session.cartData && req.session.cartData.length > 0) {
    res.locals.cartHeader = 'item-in-cart';
  }

  res.locals.errorMessage = req.session.errorMessage;
  res.locals.email = req.session.email;
  res.locals['confirm-email'] = req.session['confirm-email'];
  res.locals.nameTitle = req.session.nameTitle;

  if (res.locals.nameTitle === 'option2') {
    res.locals.option2 = 'selected';
  }

  res.locals.name = req.session.name;
  res.locals.surname = req.session.surname;
  res.locals.street = req.session.street;
  res.locals.streetNumber = req.session.streetNumber;
  res.locals.areacode = req.session.areacode;
  res.locals.city = req.session.city;
  res.locals.country = req.session.country;

  if (res.locals.country === 'option2') {
    res.locals.countryOption2 = 'selected';
  } else if (res.locals.country === 'option3') {
    res.locals.countryOption3 = 'selected';
  }

  res.locals.paymentMethod = req.session.paymentMethod;

  if (res.locals.paymentMethod === 'option2') {
    res.locals.paymentMethodOption2 = 'selected';
    res.locals.displayPaymentMethodOption1 = 'display: none;';
    res.locals.displayPaymentMethodOption2 = 'display: flex;';
  }

  res.locals.paypalEmail = req.session.paypalEmail;
  res.locals.cardHolder = req.session.cardHolder;
  res.locals.cardNumber = req.session.cardNumber;
  res.localscvc = req.session.cvc;
  next();
}

module.exports = errorMessage;
