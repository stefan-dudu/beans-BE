const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './.env' });

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('Connection successful');
  });

const beanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A bean must have a price'],
    unique: true,
  },
  rating: { type: Number, default: 3.33 },
  price: {
    type: Number,
    required: true,
  },
});

const Bean = mongoose.model('Bean', beanSchema);

const testBean = new Bean({
  name: 'Paraguay',
  rating: 4.7,
  price: 12.5,
});

testBean
  .save()
  .then((doc) => {
    console.log(doc);
  })
  .catch((err) => {
    console.log(err);
  });

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`it ran 2nd time`);
});
