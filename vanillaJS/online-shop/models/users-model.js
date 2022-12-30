const db = require('../data/database');
const bcrypt = require('bcrypt');

// saltRounds increases the time needed to calculate a hash, the higher the value the higher the time needed
const saltRounds = 10;

class User {
  constructor(userEmail, userPassword) {
    this.userEmail = userEmail;
    this.userPassword = userPassword;
  }

  async createUser() {
    await db
      .getDb()
      .collection('users')
      .insertOne({
        email: this.userEmail,
        password: await bcrypt.hash(this.userPassword, saltRounds),
      });
  }
}

module.exports = User;
