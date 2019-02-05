/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);
var idCase1="";    //First test case we are inserting into the DB
var idCase2="";    //Second test case we are inserting into the DB
suite('Functional Tests', function() {
  
    suite('POST /api/issues/{project} => object with issue data', function() {
      
      test('Every field filled in', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
         assert.equal(res.status, 200);

         //fill me in too!
         
         //Test if all properties exist
         assert.property(res.body, 'issue_title');
         assert.property(res.body, 'issue_text');
         assert.property(res.body, 'created_by');
         assert.property(res.body, 'assigned_to');
         assert.property(res.body, 'status_text');
         assert.property(res.body, 'created_on');
         assert.property(res.body, 'updated_on');
         assert.property(res.body, 'open');
         assert.property(res.body, '_id');

         //Test if all properties equal what we expect
         assert.equal(res.body.issue_title, 'Title');
         assert.equal(res.body.issue_text, 'text');
         assert.equal(res.body.created_by, 'Functional Test - Every field filled in');
         //Test optional fields that we received explicitly 
         assert.equal(res.body.assigned_to, 'Chai and Mocha');
         assert.equal(res.body.status_text, 'In QA');
         //Test fields we received implicitly
         assert.equal(res.body.project_name, 'test');
         assert.equal(res.body.open, true);
         //Test fields we created on insertion exist
         
         idCase1 = res.body._id;
         

          done();
        });
      });
      
      test('Required fields filled in', function(done) {
        chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          //assigned_to: 'Chai and Mocha',    //Optional field left out
          //status_text: 'In QA'              //Optional field left out
        })
        .end(function(err, res){
         assert.equal(res.status, 200);
          //fill me in too!
         
         //Test if all properties exist
         assert.property(res.body, 'issue_title');
         assert.property(res.body, 'issue_text');
         assert.property(res.body, 'created_by');
         assert.property(res.body, 'assigned_to');
         assert.property(res.body, 'status_text');
         assert.property(res.body, 'created_on');
         assert.property(res.body, 'updated_on');
         assert.property(res.body, 'open');
         assert.property(res.body, '_id');          
          
         //Test if all properties equal what we expect
         assert.equal(res.body.issue_title, 'Title');
         assert.equal(res.body.issue_text, 'text');
         assert.equal(res.body.created_by, 'Functional Test - Every field filled in');
         //Test optional fields that we received explicitly 
         assert.equal(res.body.assigned_to, '');
         assert.equal(res.body.status_text, '');
         //Test fields we received implicitly
         assert.equal(res.body.project_name, 'test');
         assert.equal(res.body.open, true);
         
         idCase2 = res.body._id;

          done();
        });
      });
      
      test('Missing required fields', function(done) {
        chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          //created_by: 'Functional Test - Every field filled in',    //This field is required but we are purposefully leaving it out to get the test error message
          //assigned_to: 'Chai and Mocha',    //Optional field left out
          //status_text: 'In QA'              //Optional field left out
        })
        .end(function(err, res){
         assert.equal(res.status, 200);
                  
         //Test required fields that we received explicitly 
         assert.equal(res.text, 'missing inputs');


          done();
        });
      });
      
    });
    
    suite('PUT /api/issues/{project} => text', function() {
      
      test('No body', function(done) {
       chai.request(server)
        .put('/api/issues/test')
        .send({                //Send no parameters for this test
          //issue_title: 'Title',
          //issue_text: 'text',
          //created_by: 'Functional Test - Every field filled in',    
          //assigned_to: 'Chai and Mocha',
          //status_text: 'In QA'
        })
        .end(function(err, res){
         assert.equal(res.status, 200);
                  
         //Test required fields that we received explicitly 
         assert.equal(res.text, 'missing inputs');


          done();
        });
      });
      
      test('One field to update', function(done) {
        chai.request(server)
        .put('/api/issues/test')
        .send({
          _id: idCase1,
          issue_title: 'UPDATED - Single Field Update',    //Only updating this field
          //issue_text: 'text',
          //created_by: 'Functional Test - Every field filled in',    
          //assigned_to: 'Chai and Mocha',
          //status_text: 'In QA'
        })
        .end(function(err, res){
         assert.equal(res.status, 200);       
         //Test required fields that we received explicitly 
         assert.equal(res.text, "successfully updated");
          done();
        });
      });
      
      test('Multiple fields to update', function(done) {
        chai.request(server)
        .put('/api/issues/test')
        .send({
          _id: idCase2,
          issue_title: 'UPDATED - Multi Field Update',    //Update this field
          //issue_text: 'text',
          created_by: 'Functional Test - PUT - Multiple fields to update',   //And update this field 
          //assigned_to: 'Chai and Mocha',
          //status_text: 'In QA'
        })
        .end(function(err, res){
         assert.equal(res.status, 200);
         //Test required fields that we received explicitly 
         assert.equal(res.text, "successfully updated");
          done();
        });
      });
      
    });
    
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      
      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({})      //No filter = get all cases in DB under this project
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.equal(res.body.length > 1, true);    //We've inserted two elements into the DB, there should be at least 2 that come back
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
      test('One filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({
          assigned_to: 'Chai and Mocha'     //One inputted case still has this title - we will search for that
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.equal(res.body.length >= 1, true);    //We've inserted two elements into the DB, there should be at least 2 that come back
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.equal(res.body[0].open, true);
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });

      });
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({
          //issue_title: 'Title',
          issue_text: 'text',      //First filter
          //created_by: 'Functional Test - Every field filled in',    //This field is required but we are purposefully leaving it out to get the test error message
          //assigned_to: 'Chai and Mocha',
          //status_text: 'In QA',
          open : true      //Second filter
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.equal(res.body[0].issue_text, 'text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.equal(res.body[0].open, true);
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
    });
    
    suite('DELETE /api/issues/{project} => text', function() {
      
      test('No _id', function(done) {
        chai.request(server)
        .delete('/api/issues/test')
        .send({
          //_id:idCase1        //No inputted ID, should return with an error
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'missing inputs');
          
          done();
        });
      });
      
      test('Valid _id', function(done) {
        chai.request(server)
        .delete('/api/issues/test')
        .send({
          _id:idCase2      //Delete the second test case
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          var expected = 'deleted ' + idCase2;
          assert.equal(res.text, expected);
           done();
        });

     });  
      
      test('Valid _id2', function(done) {
        chai.request(server)
        .delete('/api/issues/test')
        .send({
          _id:idCase1     //Delete the first test case so we don't fill the DB with test cases
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          var expected = 'deleted ' + idCase1;
          assert.equal(res.text, expected);
           done();
        });
   });  
  });

});
