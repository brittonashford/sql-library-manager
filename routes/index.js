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

//home page redirects to /books route
router.get('/', function(req, res, next){
  res.redirect('/books');
})

//main books page GET request
router.get('/books', asyncHandler(async(req, res, next) => {
  const books = await Book.findAll();
  res.render('books/books', { books, title: 'Library Catalog' });
}));

//add book GET request
router.get('/books/new', asyncHandler(async(req, res, next) => {

  res.render('books/new');
}))

//add book POST request
router.post('books/new', asyncHandler(async(req, res, next) => {

}))

//book detail GET request
router.get('/books/:id', asyncHandler(async(req, res, next) => {

}))

//update book POST request
router.post('books/:id', asyncHandler(async(req, res, next) => {

}))

//delete books POST request
router.post('books/:id/delete', asyncHandler(async(req, res, next) => {

}))

module.exports = router;
