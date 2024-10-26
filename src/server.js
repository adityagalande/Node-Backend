/*
import mongoose from "mongoose";
import { DB_NAME } from "./constants";

// Always use async-await and try-catch while connecting to DB, because sometime it will take time to connection

// we put semicolon before IIFE function because to cleanup of code
;(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
  } catch (error) {
    console.error('MongoDB connection error:', error)
  }
})()
*/

