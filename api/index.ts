import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from '../app';

dotenv.config({ path: './.env' });

process.on('uncaughtException', (err: Error) => {
  console.log('UNCAUGHT REJECTION ✌️✌️. Going to sleep');
  console.log(err.name, err.message);
  process.exit(1);
});

mongoose.connect(process.env.DATABASE as string).then(() => {
  console.log('Connection successful');
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Server ready on port ${port}.`);
});

process.on('unhandledRejection', (err: Error) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION 💥💥💥. Going to sleep');
  server.close(() => {
    process.exit(1);
  });
});
