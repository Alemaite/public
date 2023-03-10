const express = require('express');
const db = require('./data/database');
const session = require('express-session');
const mongodbStore = require('connect-mongodb-session');

const app = express();
const MongoDbStore = mongodbStore(session);
const sessionStore = new MongoDbStore({
  uri: 'mongodb://127.0.0.1:27017',
  databaseName: 'online-shop',
  collection: 'sessions',
});

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(
  session({
    secret: 'super-secret',
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const multer = require('multer');
const getMulterStorageConfig = require('./config/multer');
const multerStorageConfig =
  getMulterStorageConfig.getMulterStorageConfig(multer);
const upload = multer({ storage: multerStorageConfig });

app.use(upload.single('product-image-path'));

const csrf = require('csurf');
const csrfMiddleWare = require('./middlewares/csrf-middleware');

app.use(csrf());
app.use(csrfMiddleWare);

const authMiddleware = require('./middlewares/auth-middleware');

app.use(authMiddleware);

const checkoutMiddleware = require('./middlewares/checkout-middleware');

app.use(checkoutMiddleware);

const checkIfAdminMiddleware = require('./middlewares/admin-middleware');

app.use('/admin', checkIfAdminMiddleware);

const authRoutes = require('./routes/routes-auth');
const shopRoutes = require('./routes/routes-shop');
app.use(shopRoutes);
app.use(authRoutes);

app.use(function (error, req, res, next) {
  res.status(500).render('500');
});

app.use(function (req, res) {
  res.status(404).render('404');
});

db.connectToDb().then(function () {
  app.listen(3000);
});

// Learn GIT from the command line

// db.sessions.updateOne({_id: 'fq21WGQdEThqZImFdJGAoXbeGPBi0qS5'}, {$unset: {"session.cartData": 1}}) to update a nested
// object
