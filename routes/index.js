const express = require('express');
const router = express.Router();
const Book = require('../models').Book;

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  async (req, res) => {
    const books = await Book.findAll();
    res.json(books);
  }
});

module.exports = router;
