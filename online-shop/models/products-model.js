const db = require('../data/database');

class Products {
  constructor(title, summary, imagePath, price) {
    this.title = title;
    this.summary = summary;
    this.imagePath = imagePath;
    this.price = +price;
  }

  static async getAllProductData() {
    return await db.getDb().collection('products').find().toArray();
  }

  async postNewProduct() {
    return await db.getDb().collection('products').insertOne({
      title: this.title,
      summary: this.summary,
      imagePath: this.imagePath,
      price: this.price,
    });
  }

  static async removeProduct(objectId) {
    const removedProduct = await db
      .getDb()
      .collection('products')
      .deleteOne({ _id: objectId });
    return removedProduct;
  }

  static async getProductDetails(objectId) {
    return await db.getDb().collection('products').findOne({ _id: objectId });
  }

  async updateOneProduct(objectId) {
    await db
      .getDb()
      .collection('products')
      .updateOne(
        { _id: objectId },
        {
          $set: {
            title: this.title,
            summary: this.summary,
            imagePath: this.imagePath,
            price: this.price,
          },
        }
      );
      return;
  }
}

module.exports = Products;
