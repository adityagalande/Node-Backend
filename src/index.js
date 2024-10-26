import dotenv from 'dotenv';  // if you want to use import dotenv then this line of code is must in package.json ("dev": "nodemon -r dotenv/config --experimental-json-modules src/index.js")
import connectDB from './db/index.js';

dotenv.config({
  path: './env'
})

connectDB();