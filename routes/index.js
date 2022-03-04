const express = require('express');
const router = express.Router();
const Book = require('../models').Book;

//async wrapper function
function asyncHandler(callback){
  return async(req, res, next) => {
    try{
      await callback(req, res, next)
    } catch(error){
      next(error)
    }
  }
}


/* GET home page. */
router.get('/', asyncHandler(async(req, res, next) => {
  const books = await Book.findAll();
  res.render('index', { books, title: 'Books' });
}));

module.exports = router;
