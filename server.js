const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './.env' });

mongoose.connect(process.env.DATABASE).then(() => {
  console.log('Connection successful');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  // console.log(`it ran 2nd time`);
});
