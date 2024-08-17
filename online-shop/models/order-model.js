const db = require('../data/database');

class Orders {
  constructor(
    email,
    title,
    firstName,
    surname,
    street,
    streetNumber,
    areaCode,
    city,
    country,
    paymentMethod,
    paypalEmail,
    cardHolder,
    cardNumber,
    cvc,
    products
  ) {
    this.email = email;
    this.title = title;
    this.firstName = firstName;
    this.surname = surname;
    this.street = street;
    this.streetNumber = streetNumber;
    this.areaCode = areaCode;
    this.city = city;
    this.country = country;
    this.paymentMethod = paymentMethod;
    this.paypalEmail = paypalEmail;
    this.cardHolder = cardHolder;
    this.cardNumber = cardNumber;
    this.cvc = cvc;
    this.products = products;
  }

  async insertOrder() {
    const order = await db.getDb().collection('orders').insertOne({
      email: this.email,
      title: this.title,
      firstName: this.firstName,
      surname: this.surname,
      street: this.street,
      streetNumber: this.streetNumber,
      areaCode: this.areaCode,
      city: this.city,
      country: this.country,
      paymentMethod: this.paymentMethod,
      paypalEmail: this.paypalEmail,
      cardHolder: this.cardHolder,
      cardNumber: this.cardNumber,
      cvc: this.cvc,
      products: this.products,
    });
    return;
  }

  static async getAllOrders() {
    return await db.getDb().collection('orders').find().toArray();
  }

  static async getOrder(loggedInEmail) {
    const order = await db
      .getDb()
      .collection('orders')
      .find({ email: loggedInEmail })
      .toArray();
    return order;
  }

  static async getOrderById(id) {
    return await db.getDb().collection('orders').findOne({ _id: id });
  }
}

module.exports = Orders;
