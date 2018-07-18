/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({title: 'Test Title'})
          .end( (err, res) => {
              assert.equal(res.body.title, 'Test Title');
              assert.isArray(res.body.comments, 'Should be an Array');
              assert.property(res.body, '_id');
              assert.property(res.body, 'title');
              assert.property(res.body, 'comments');
              assert.property(res.body, 'commentcount');
              done();
          })
      });
      
      test('Test POST /api/books with no title given', function (done) {
       chai.request(server)
        .post('/api/books')
        .end( (err, res) => {
            assert.equal(res.text, 'error no title provided');
            done();
        })
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
            .get('/api/books')
            .end( (err, res) => {
                assert.isArray(res.body, 'Should be an Array');
                assert.property(res.body[0], '_id', 'Should contain a book _id');
                assert.property(res.body[0], 'title', 'Should contain book title');
                assert.isArray(res.body[0].comments, 'should be an Array');
                assert.property(res.body[0], 'commentcount', 'Should contain comment count');
                done();
            })
        });     
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
        test('Test GET /api/books/[id] with id not in db',  function(done){
            chai.request(server)
                .get('/api/books/5b4f4025eed31d381dd64bb0')
                .end( (err, res) => {
                    assert.equal(res.text, 'no book exists');
                    done();
                })
        });
      
        test('Test GET /api/books/[id] with valid id in db',  function(done){
                chai.request(server)
                    .get('/api/books/5b4f5cff4902ae5be93f097b')
                    .end( (err, res) => {
                        assert.equal(res.status, 200);
                        assert.property(res.body, '_id');
                        assert.property(res.body, 'title');
                        assert.property(res.body, 'comments');
                        assert.property(res.body, 'commentcount');
                        done();
                    })
            });
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      test('Test POST /api/books/[id] with comment', function (done) {
        chai.request(server)
            .post('/api/books/5b4f5cff4902ae5be93f097b')
            .send({ comment: 'another test comment' })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.property(res.body, '_id', 'Should contain a book id');
                assert.property(res.body, 'title', 'Should contain a book title');
                assert.isArray(res.body.comments, 'Comments should be an array');
                assert.property(res.body, 'comments', 'Should contain a comments property');
                assert.property(res.body, 'commentcount', 'Should contain commentcount');
                done();
            });
        });
      
    });

  });

});
