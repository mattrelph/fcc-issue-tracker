/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
const dbCollection = "fcc-issue-tracker";
const  db = require('../db/database.js');
const ObjectId = require('mongodb').ObjectID;

module.exports = function (app) {
  
  db.connect(() => {
    app.listen(function (){
        console.log(`Database Listening`);
    });
  });
  app.route('/api/issues/:project')
  
      //Retrieve database entries
    .get(function (req, res){      
      var project={}; 
      
      var optionalProperties =['_id', 'issue_title', 'issue_text', 'created_by', 'assigned_to' , 'status_text', 'open'];
      getOptional(optionalProperties, req.body, project, false);  
      //console.log('GET INPUT: ' + JSON.stringify(project));
      //console.log(Object.keys(project).length);
      var keylist = Object.keys(project);
      for (var i=Object.keys(project).length-1; i >=0;--i)
      {
        if (project[keylist[i]] == "")
        {
          delete project[keylist[i]];      //Trimming the empty keys that were sent.            
        }
      }
      project.project_name = req.params.project;
      //console.log(JSON.stringify(project));
      db.get().collection(dbCollection).find(project).toArray(function (err, result) 
      {
        if(err) 
        {
          console.log('Database read error: ' + err);
          res.status(500).end();
        } 
        else 
        {
          //console.log('GET OUTPUT: ' + JSON.stringify(result));
          res.status(200).json(result);    //Upon successful insertion, we will now respond with the inserted object.
        }


      });   
    })
  
  
    //Create a new service issue
    .post(function (req, res){
      
      var project={};
      project.project_name = req.params.project;

      var requiredProperties = ['issue_title', 'issue_text', 'created_by'];
      var optionalProperties =['assigned_to' , 'status_text'];
      
      getRequired(requiredProperties, req.body, project);
      if (project.hasOwnProperty('error'))    //If required info is missing, we can stop here
      {
        res.status(200).send(project.error);
        return;
      }
      else
      {
        getOptional(optionalProperties, req.body, project, true);        
        project.created_on = Date.now();
        project.updated_on = project.created_on;
        project.open = true;
        //console.log("POST INPUT: " + JSON.stringify(project));
        db.get().collection(dbCollection).insertOne(project, function (err, result)     //Retrieve cases based on query criteria
        {
          if(err) 
          {
            console.log('Database insertion error: ' + err);
            res.status(500).end();
          } 
          else 
          {
            //console.log("POST OUTPUT: " + JSON.stringify(project));
            res.status(200).json(project);    //Upon successful insertion, we will now respond with the inserted object.
          }

        })
      }
    })

    //Update case entry
   .put(function (req, res){
      var project={};
      project.project_name = req.params.project;
 
      var requiredProperties = ['_id'];
      var optionalProperties =['issue_title', 'issue_text', 'created_by', 'assigned_to' , 'status_text', 'open'];
      getRequired(requiredProperties, req.body, project);
      if (project.hasOwnProperty('error'))    //If required info is missing, we can stop here
      {
        res.status(200).send(project.error);
        return;
      }
      else
      {
        getOptional(optionalProperties, req.body, project, false);  
        //console.log("PUT INPUT: " + JSON.stringify(project));
        var keylist = Object.keys(project);
        for (var i=Object.keys(project).length-1; i >=0;--i)
        {
          if ((project[keylist[i]] == "")&&(typeof(project[keylist[i]]) !== "boolean"))    //Get rid of unused fields
          {
            delete project[keylist[i]];      //Trimming the empty keys that were sent.            
          }
        }
        //console.log("Trimmed version of update: " + JSON.stringify(project));
        if (Object.keys(project).length <=1)      //If we only got the id, and nothing else, there is nothing to update.
        {
          res.status(200).send('no updated field sent');
        }
        else
        {
          project.updated_on = Date.now();
          var myquery = { "_id" : ObjectId(project._id) };
          delete project._id;  //Performing an update on the path '_id' would modify the immutable field '_id', so we remove it from the update list
          var newvalues = { $set: project};
          db.get().collection(dbCollection).updateOne(myquery, newvalues, function (err, result) 
          {
            if(err) 
            {
              console.log('Database update error: ' + err);
              res.status(500).end();
            } 
            else 
            {
              //console.log("PUT OUTPUT: " + JSON.stringify(project));
              //console.log(JSON.stringify(result));
              if (result.result.n == 1)    //Check if something actually got updated
              {
                res.status(200).send('successfully updated');    //Notify upon successful update.
              }
              else
              {
                res.status(200).send("not updated: " + JSON.stringify(myquery));  //No records got updated. Check your id.
                //console.log("not updated: " + JSON.stringify(myquery));  //No records got updated. Check your id.
                //console.log("nModified = " + result.result.n);
              }
            }
          });   
        }
      }

    })

    .delete(function (req, res){
      var project={};
      project.project_name = req.params.project;
 
      var requiredProperties = ['_id'];
      getRequired(requiredProperties, req.body, project);
      //console.log("DELETE INPUT: " + JSON.stringify(project));
      if (project.hasOwnProperty('error'))    //If required info is missing, we can stop here
      {
        res.status(200).send(project.error);
        return;
      }
      else
      {
        var keylist = Object.keys(project);
        for (var i=Object.keys(project).length-1; i >=0;--i)
        {
          if (project[keylist[i]] == "")
          {
            delete project[keylist[i]];      //Trimming the empty keys that were sent.            
          }
        }

        if (Object.keys(project).length <=1)      //If we only got the id, and nothing else, there is nothing to update.
        {
          res.status(200).send('missing inputs');
        }
        else
        {
          var myquery = { "_id" : ObjectId(project._id) };
          db.get().collection(dbCollection).deleteOne(myquery, function (err, result) 
          {
            if(err) 
            {
              console.log('Database document delete error: ' + err);
              res.status(500).end();
            } 
            else 
            {
              //console.log("DELETE OUTPUT: " + JSON.stringify(project));
              //console.log("DELETE OUTPUT: " + JSON.stringify(result));
              res.status(200).send('deleted '+ project._id);    //Notify upon successful deletion.
            }
          });   
        }
      }

    });
   
};

/*getRequired  - This function gets pulls a list of required parameters out of res.body. +

Inputs are 

The parameter string array we are looking for: list  

The res.body we are searching: body 

The return object which we need updated: project

If we don't get all of our required parameters, we will add an error key to the project object.

*/
function getRequired(list, body, project)
{
  for(var i=0; i< list.length; ++i)
      {
        if (body.hasOwnProperty(list[i]))    //Store required property, if it exists.
        {
          project[list[i]] = body[list[i]];          
        }
        else    //If a required property is missing, we reply with a syntax error
        {
          project.error = 'missing inputs';
          break;
        }

      }
  
}


/*getOptional  - This function gets pulls a list of optional parameters out of res.body. +

Inputs are 

The parameter string array we are looking for: list  

The res.body we are searching: body 

The return object which we need updated: project

boolean addAnyhow which adds allows us to add keys when they are not in the body

*/
function getOptional(list, body, project, addAnyhow)
{
  for(var k=0; k< list.length; ++k)    //Now, for storing the optional properties
  {
    if (body.hasOwnProperty(list[k]))
    {
      if (list[k] == 'open')  //Special case boolean (Don't want to store as text)
      {
        if((body[list[k]] == 'false')||(body[list[k]] == false))
        {
          project[list[k]] = false;
        }
        else
        {
          project[list[k]] = true;          
        }
      }
      else
      {
        project[list[k]] = body[list[k]];    //Everything else is stored as text, so it does not require any special formatting
      }
      
    }
    else if (addAnyhow)
    {
      project[list[k]] = '';
      
    }
  }
  
}