const mongoose = require('mongoose');

// replace your database connection string here
mongoose.connect('mongodb://127.0.0.1/trails', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

// database connection event
db.on('connected', function () {
  console.log(`Mongoose connected to: ${db.host}:${db.port}`);
});
