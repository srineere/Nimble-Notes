const express = require('express');
const mongoose = require('mongoose');
const noteRoutes = require('./routes/noteRoutes');
const authRoutes = require('./routes/authRouter');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');

// app
const app = express();

// connect
const dbURI = 'mongodb://test-user:test-password@nimblenotes-shard-00-00.mihom.mongodb.net:27017,nimblenotes-shard-00-01.mihom.mongodb.net:27017,nimblenotes-shard-00-02.mihom.mongodb.net:27017/NimbleNotes?ssl=true&replicaSet=atlas-12r9m5-shard-0&authSource=admin&retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(result => {
        app.listen(3000);
        console.log('server started')
    })  // listening
    .catch(err => console.log(err));

// view engine
app.set('view engine','ejs');

// middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});
app.use(express.json());
app.use(cookieParser());

// routes
app.get('*', checkUser);
app.get('/', (req, res) => {res.redirect('/notes'); });
app.use('/notes', requireAuth, noteRoutes);
app.use(authRoutes);
app.use((req,res) => {res.status(404).render('404', { title: '404' });} ) //  404 page