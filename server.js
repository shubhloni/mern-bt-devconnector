const express = require('express');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

// Define routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, (req, res) => {
  console.log('Server Started');
});
