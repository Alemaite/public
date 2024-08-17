function getMulterStorageConfig(multer) {
  return multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/images/products-images');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    },
  });
}

module.exports = {
  getMulterStorageConfig: getMulterStorageConfig,
};
