const db = require('../data/database');
const bcrypt = require('bcrypt');

function validateCheckoutForm(req) {
  const areNumbers = /^[0-9]+$/;
  const areStrings = /[a-zäöüß]+$/i;
  let validation = false;

  if (
    req.body['email'].trim() !== '' &&
    req.body['email'].includes('@') &&
    req.body['email'].includes('.') &&
    req.body['email'] === req.body['confirm-email']
  ) {
    validation = true;
  } else {
    req.session.errorMessage = 'Please check e-mail-address';
    saveWrongInput(req);
    return validation;
  }

  const nameOk = areStrings.test(req.body.name);
  const surnameOk = areStrings.test(req.body.surname);
  const streetOk = areStrings.test(req.body['address-street']);
  const cityOk = areStrings.test(req.body['address-city']);

  if (
    validation === true &&
    nameOk &&
    surnameOk &&
    streetOk &&
    req.body['address-street-number'].trim() !== '' &&
    req.body['address-areacode'].trim() !== '' &&
    cityOk
  ) {
    validation = true;
  } else {
    req.session.errorMessage = 'Please check address & names';
    saveWrongInput(req);
    validation = false;
    return validation;
  }

  const cardHolderOk = areStrings.test(req.body['card-holder']);
  const ccNumberOk = areNumbers.test(req.body['card-number']);
  const cvcOk = areNumbers.test(req.body.cvc);

  if (
    (req.body['payment-methods'] === 'paypal' &&
      req.body['paypal-email'].trim() !== '' &&
      req.body['paypal-email'].includes('@') &&
      req.body['paypal-email'].includes('.')) ||
    (req.body['payment-methods'] === 'credit-card' &&
      cardHolderOk &&
      ccNumberOk &&
      cvcOk)
  ) {
    validation = true;
  } else {
    req.session.errorMessage = 'Please check your payment information';
    saveWrongInput(req);
    validation = false;
    return validation;
  }
  clearCheckoutSessionData(req);
  return validation;
}

function clearCheckoutSessionData(req) {
  req.session.email = '';
  req.session['confirm-email'] = '';
  req.session.nameTitle = '';
  req.session.name = '';
  req.session.surname = '';
  req.session.street = '';
  req.session.streetNumber = '';
  req.session.areacode = '';
  req.session.city = '';
  req.session.country = '';
  req.session.paymentMethod = '';
  req.session.paypalEmail = '';
  req.session.cardHolder = '';
  req.session.cardNumber = '';
  req.session.cvc = '';
  return;
}

function saveWrongInput(req) {
  req.session.email = req.body.email;
  req.session['confirm-email'] = req.body['confirm-email'];
  req.session.nameTitle = req.body.title;

  if (req.session.nameTitle === 'Mrs.') {
    req.session.nameTitle = 'option2';
  }

  req.session.name = req.body.name;
  req.session.surname = req.body.surname;
  req.session.street = req.body['address-street'];
  req.session.streetNumber = req.body['address-street-number'];
  req.session.areacode = req.body['address-areacode'];
  req.session.city = req.body['address-city'];
  req.session.country = req.body['address-country'];

  if (req.session.country === 'france') {
    req.session.country = 'option2';
  } else if (req.session.country === 'germany') {
    req.session.country = 'option3';
  }

  req.session.paymentMethod = req.body['payment-methods'];

  if (req.session.paymentMethod === 'credit-card') {
    req.session.paymentMethod = 'option2';
  }

  req.session.paypalEmail = req.body['paypal-email'];
  req.session.cardHolder = req.body['card-holder'];
  req.session.cardNumber = req.body['card-number'];
  req.session.cvc = req.body.cvc;
  return;
}

function checkSignUpFormInput(req) {
  if (
    req.body['signup-password'].length > 6 &&
    req.body['email'].trim() !== '' &&
    req.body['email'].includes('@') &&
    req.body['email'].includes('.') &&
    req.body['email'] === req.body['confirm-email']
  ) {
    return true;
  } else {
    req.session.errorData = {
      hasError: true,
      errorMessage:
        'Please check your input. Password needs to have at least 7 characters. E-Mail addresses need to match.',
    };
    req.session.inputData = {
      enteredEmail: req.body['email'],
      enteredConfirmEmail: req.body['confirm-email'],
      enteredPassword: req.body['signup-password'],
    };
    return false;
  }
}

async function checkIfUserExistsOnSignup(req) {
  const findIfUserExists = await db
    .getDb()
    .collection('users')
    .findOne({ email: req.body['email'] });
  if (findIfUserExists) {
    return true;
  } else {
    return false;
  }
}

async function checkIfUserExistsOnLogin(req) {
  const userFoundInDb = await db.getDb().collection('users').findOne({
    email: req.body['login-email'],
  });

  if (userFoundInDb) {
    return true;
  } else {
    req.session.errorData = {
      hasError: true,
      errorMessage: 'User not signed up or password incorrect.',
    };
    req.session.inputData = {
      enteredEmail: req.body['login-email'],
      enteredPassword: req.body['login-password'],
    };
    req.session.save(function () {
      return false;
    });
    return;
  }
}

async function checkIfUserIsAdmin(req) {
  const userIsAdmin = await db
    .getDb()
    .collection('users')
    .findOne(
      { email: req.body['login-email'] },
      { projection: { isAdmin: 1, _id: 0 } }
    );

  if (userIsAdmin && userIsAdmin.isAdmin) {
    return true;
  } else {
    return false;
  }
}

async function checkPassword(req) {
  const getUserObject = await db
    .getDb()
    .collection('users')
    .findOne({ email: req.body['login-email'] });

  if (getUserObject) {
    const comparePasswords = await bcrypt.compare(
      req.body['login-password'],
      getUserObject.password
    );
    if (comparePasswords) {
      return true;
    } else {
      req.session.errorData = {
        hasError: true,
        errorMessage: 'User not signed up or password incorrect.',
      };
      req.session.inputData = {
        enteredEmail: req.body['login-email'],
        enteredPassword: req.body['login-password'],
      };
      req.session.save(function () {
        return false;
      });
    }
  } else {
    return;
  }
  return;
}

function resetSessionData(req) {
  req.session.errorData = {
    hasError: null,
    errorMessage: '',
  };
  req.session.inputData = {
    enteredEmail: '',
    enteredConfirmEmail: '',
    enteredPassword: '',
  };
  return;
}

module.exports = {
  checkSignUpFormInput: checkSignUpFormInput,
  checkIfUserExistsOnSignup: checkIfUserExistsOnSignup,
  checkIfUserExistsOnLogin: checkIfUserExistsOnLogin,
  checkIfUserIsAdmin: checkIfUserIsAdmin,
  checkPassword: checkPassword,
  resetSessionData: resetSessionData,
  validateCheckoutForm: validateCheckoutForm,
  saveWrongInput: saveWrongInput,
  clearCheckoutSessionData: clearCheckoutSessionData,
};
