// index.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
require('dotenv').config();

const adminAuthRoutes = require('./src/routes/adminAuth.js');
const adminRoutes = require('./src/routes/adminRoutes.js');

const userAuthRoutes = require('./src/routes/authUser.js');
const userRoutes = require('./src/routes/userRoutes.js');
const fisherRoutes = require('./src/routes/fisherRoutes');
const fisherAuthRoutes = require('./src/routes/fisherAuthRoutes');
const fisheriesRoutes = require('./src/routes/fisheriesRoutes.js');
const catchRoutes = require('./src/routes/catchRoutes.js');
const vesselRoutes = require('./src/routes/vesselRoutes.js');
const gearRoutes = require('./src/routes/gearRoutes.js');
const fisherLogRoutes = require('./src/routes/fisherLogRoutes');

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

const main = async() => {
const PORT = process.env.PORT;
const mongoURI = process.env.DATABASE_URI;

    try{
      // Connect to MongoDB
      await mongoose.connect(mongoURI)
      .then(() => {
        console.log('Connected to the Database');

      })
      .catch(err => console.error('Error connecting to MongoDB:', err));
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
        // Define schema and models, perform CRUD operations, etc.
      }catch(err) {}
    }
main();

 // Configure express-session
app.use(session({ 
    secret: 'keyboard cat', // This should be a long, random string used to sign the session ID cookie
    resave: false, 
    saveUninitialized: false 
  }));
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error' });
});  
app.use(passport.initialize());
app.use(passport.session());  

app.use('/api/auth/admin', adminAuthRoutes);
app.use('/api/admin', adminRoutes);

app.use('/api/auth', userAuthRoutes); 
app.use('/api/users', userRoutes);

app.use('/api/fisher', fisherRoutes);
app.use('/api/auth/fisher', fisherAuthRoutes);

app.use('/api/fisheries', fisheriesRoutes);
app.use('/api/catch', catchRoutes);
app.use('/api/vessels', vesselRoutes);  
app.use('/api/gears', gearRoutes);
app.use('/api/fisherlogs', fisherLogRoutes);
  
// const crypto = require('crypto');

// Generate a random secret key
// const secretKey = crypto.randomBytes(32).toString('hex');
// console.log(secretKey);



