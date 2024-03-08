const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

process.on('uncaughtException', (err) => {
  console.log('UNCOUGHT REJECTION ✌️✌️. Going to sleep');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './.env' });

mongoose.connect(process.env.DATABASE).then(() => {
  console.log('Connection successful');
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  // console.log(`it ran 2nd time`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDELER REJECTION 💥💥💥. Going to sleep');
  server.close(() => {
    process.exit(1);
  });
});
