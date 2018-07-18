/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId; // ObjectId(req.body._id);
const DATABASE = process.env.DB; // MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res) {
      // Response will be array of book objects
      // Json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      MongoClient.connect(DATABASE, (err, db) => {
          if (err) return console.log(err);
          db.collection('library').find({}).toArray((err, docs) => {
              if (err) return console.log(err);
              if (docs) return res.json(docs);
          });
          db.close();
      })
    })
    
    .post(function (req, res) {
      if (!req.body.title) return res.send('error no title provided');
    
      let book = {
          title: req.body.title,
          comments: [],
          commentcount: 0
      }
      
      // Response will contain new book object including atleast _id and title
      MongoClient.connect(DATABASE, (err, db) => {
          db.collection('library').insert(book, (err, doc) => {
              if (err) return console.log(err);
              if (doc) return res.json({ _id: book._id, title: book.title, comments: [], commentcount: 0 });
              db.close();
          });
      });
    })
    
      .delete(function (req, res) {
        // If successful response will be 'complete delete successful'
        MongoClient.connect(DATABASE, (err, db) => {
            if (err) return console.log(err);
            db.collection('library').remove({}, (err, response) => {
                if (err) return console.log(err);
                if (response) return res.send('complete delete successful');
            })
        });
      });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      if (!bookid || bookid.length !== 24) return res.send('no book exists');
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      MongoClient.connect(DATABASE, (err, db) => {
          if (err) return console.log(err);
          db.collection('library').find({_id: ObjectId(bookid)}).toArray((err, docs) => {
              if (err) return console.log(err);
              if (docs.length == 0) return res.send('no book exists');
              if (docs) return res.json(docs[0]);
          });
          db.close();
      })
    })
    
    .post(function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      if (bookid.length != 24) return res.send('book id error');
      if (comment.length == 0) return res.send('No comment added')
      // Json res format same as .get

      MongoClient.connect(DATABASE, (err, db) => {
          db.collection('library').findAndModify({_id: ObjectId(bookid)}, {}, {$push: {comments: comment}, $inc: {commentcount: 1}}, {new: true, upsert: false}, (err, response) => {
              if (err) console.log(err);
              return res.json(response.value);
          })
      });
    })
    
    .delete (function (req, res) {
      let bookid = req.params.id;
      if (bookid.length != 24) return res.send('book id error');
      MongoClient.connect(DATABASE, (err, db) => { 
          db.collection('library').deleteOne({ _id: ObjectId(bookid) }, (err, response) => {
              if (err) return console.log(err);
              else if (response && response.deletedCount == 0) return res.send('no book exists');
              else if (response && response.deletedCount == 1) return res.send('delete successful');
              db.close();
          })
      });
    });
  
};
