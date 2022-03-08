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
  res.redirect('books');
})

//books list GET request
router.get('/books', asyncHandler(async(req, res) => {
  const books = await Book.findAll();
  res.render('books', { books, title: 'Library Catalog' });
}));

//add book form GET request
router.get('/books/new', function(req, res, next){
  res.render('new-book', {book: {}, title: 'Add New Book'});
})

//add book POST request
router.post('/books/new', asyncHandler(async(req, res) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect('/books');
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      res.render('new-book', {book, errors: error.errors, title: 'Add New Book'});
    } else {
      throw error; 
    }
  }
}))

//book detail GET request
router.get('/books/:id', asyncHandler(async(req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    res.render("update-book", {book, title: book.title});
  } else {
    res.render('page-not-found');
  }
}))

//edit book POST request
router.post('/books/:id', asyncHandler(async(req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if(book) {
      await book.update(req.body);
      res.redirect('/books');
    } else {
      res.render('page-not-found');
    }
  } catch(error) {
    if(error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      book.id = req.params.id;
      res.render('update-book', {book, errors: error.errors, title: 'Edit Book'});
    } else {
      throw error;
    }
  }
}))

//delete book POST request
router.post('/books/:id/delete', asyncHandler(async(req, res) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    await book.destroy();
    res.redirect('/books');
  } else {
    res.render('page-not-found');
  }
}))

module.exports = router;
