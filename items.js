/*
  Copyright (c) 2008 - 2016 MongoDB, Inc. <http://mongodb.com>

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/


var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');


function ItemDAO(database) {
    "use strict";

    this.db = database;

    this.getCategories = function(callback) {
        "use strict";
      
	     //console.writeln('Making a call to this.getCategories function');
		 
        /*
        * TODO-lab1A
        *
        * LAB #1A: Implement the getCategories() method.
        *
        * Write an aggregation query on the "item" collection to return the
        * total number of items in each category. The documents in the array
        * output by your aggregation should contain fields for "_id" and "num".
        *
        * HINT: Test your mongodb query in the shell first before implementing
        * it in JavaScript.
        *
        * In addition to the categories created by your aggregation query,
        * include a document for category "All" in the array of categories
        * passed to the callback. The "All" category should contain the total
        * number of items across all categories as its value for "num". The
        * most efficient way to calculate this value is to iterate through
        * the array of categories produced by your aggregation query, summing
        * counts of items in each category.
        *
        * Ensure categories are organized in alphabetical order before passing
        * to the callback.
        *
        */

		var aggregation_query = [{$group:{_id:"$category",num:{$sum:1}}} , {$sort:{_id:1}} ];
		
		var item_collection=this.db.collection('item');
		var ct;
		
		item_collection.aggregate(aggregation_query, function(err , result) {
			
			 console.log('hello ' + result[0]._id + " " + result[0].num);
			 var item_count = 0;
			 
			 for(var i=0; i < result.length; i++)
			 {
			    item_count += result[i].num;  	 
			 }
			 
			 console.log('item sum is ' + item_count);
			 
			 var cat5 = [];
			 
			 var categoryAll = { _id:"All" , num:item_count};
			
			 cat5.push(categoryAll);
			 
			 
			 for(var i=0; i < result.length; i++)
			 {
			     	 
				cat5.push(result[i])
			 }
			 
			 for(var r in result)
			 {	
               console.log('What are my properties  r ' + r +  ' ' + result[r]._id);		 
			   //cat5.push(r);
			 }
			 
		     console.log('call aggregate 1'); 
			 callback(cat5);
			 
		     console.log('call aggregate 2');
					 
		});
		
		 
		
		console.log('call aggregate 3');
        var categories = [];
        var category = {
            _id: "All",
            num: 9999
        };
          
		 categories.push(ct);
        //categories.push(category)

        // TODO-lab1A Replace all code above (in this method).

        // TODO Include the following line in the appropriate
        // place within your code to pass the categories array to the
        // callback.
        //callback(categories);
    
		     console.log('call aggregate 4');
	}


    this.getItems = function(category, page, itemsPerPage, callback) {
        "use strict";

        /*
         * TODO-lab1B
         *
         * LAB #1B: Implement the getItems() method.
         *
         * Create a query on the "item" collection to select only the items
         * that should be displayed for a particular page of a given category.
         * The category is passed as a parameter to getItems().
         *
         * Use sort(), skip(), and limit() and the method parameters: page and
         * itemsPerPage to identify the appropriate products to display on each
         * page. Pass these items to the callback function.
         *
         * Sort items in ascending order based on the _id field. You must use
         * this sort to answer the final project questions correctly.
         *
         * Note: Since "All" is not listed as the category for any items,
         * you will need to query the "item" collection differently for "All"
         * than you do for other categories.
         *
         */

	    if(category == 'All')
		{
			    var number_of_items_to_skip = page * itemsPerPage;
			  
			    var item_collection=this.db.collection('item');
		     	item_collection.find({}).sort({_id:1})
				.skip(number_of_items_to_skip).limit(itemsPerPage)
				.toArray().then(function(result){
				
				console.log('calling then function now for All ');
				
				var pageItems = [];
				
				for(var i=0; i < result.length; i++)
				{
					pageItems.push(result[i]);
				}
				
				callback(pageItems);
			});
			
		}
		 else 
		 {    
	             //if number of items found greater than page then do same thing as above
			     var number_of_items_to_skip = page * itemsPerPage;
	 
			     var item_collection=this.db.collection('item');
		      	 item_collection.find({"category":category})
				.sort({_id:1})
				.skip(number_of_items_to_skip)
				.limit(itemsPerPage)
				.toArray().then(function(result) {
				
				console.log('calling then function now ');
				
				var pageItems = [];
				
				for(var i=0; i < result.length; i++)
				{
					pageItems.push(result[i]);
				}
				
				callback(pageItems);
			   /*
				 var pageItem = this.createDummyItem();
				 var pageItems = [];
				
				for (var i=0; i<5; i++) {
					pageItems.push(pageItem);
				}

				// TODO-lab1B Replace all code above (in this method).

				// TODO Include the following line in the appropriate
				// place within your code to pass the items for the selected page
				// to the callback.
				callback(pageItems);
			  */
			});
		 }
		
		 
		 /*
        var pageItem = this.createDummyItem();
        var pageItems = [];
		
        for (var i=0; i<5; i++) {
            pageItems.push(pageItem);
        }

        // TODO-lab1B Replace all code above (in this method).

        // TODO Include the following line in the appropriate
        // place within your code to pass the items for the selected page
        // to the callback.
        callback(pageItems);*/
    }


    this.getNumItems = function(category, callback) {
        "use strict";

        var numItems = 0;
		//numItems = 3;

        /*
         * TODO-lab1C:
         *
         * LAB #1C: Implement the getNumItems method()
         *
         * Write a query that determines the number of items in a category
         * and pass the count to the callback function. The count is used in
         * the mongomart application for pagination. The category is passed
         * as a parameter to this method.
         *
         * See the route handler for the root path (i.e. "/") for an example
         * of a call to the getNumItems() method.
         *
         */
		 
         // TODO Include the following line in the appropriate
         // place within your code to pass the count to the callback.
		 
		  var item_collection=this.db.collection('item');
		  
		  var find_query = "";
		  
		  if(category != 'All')
		  {
			  find_query = {"category":category};
			  
		      item_collection.find(find_query).sort({_id:1}).toArray().then(function(result) {
		
					   callback(result.length);	
		      });
			  
		  }else 
		  {
			    find_query = {};
			  
			    item_collection.find(find_query).sort({_id:1}).toArray().then(function(result) {
			
                       
					   callback(result.length);
					  
					/* console.log('item sum is ' + item_count);
					 
					 var cat5 = [];
					 
					 var categoryAll = { _id:"All" , num:item_count};
					
					 cat5.push(categoryAll);
					 
					 
					 for(var i=0; i < result.length; i++)
					 {
							 
						cat5.push(result[i])
					 }*/
					 
				
		  		
		          });
			  
			  
		  }
		  
		  	   
			   
		
      
    }


    this.searchItems = function(query, page, itemsPerPage, callback) {
        "use strict";

        /*
         * TODO-lab2A
         *
         * LAB #2A: Implement searchItems()
         *
         * Using the value of the query parameter passed to searchItems(),
         * perform a text search against the "item" collection.
         *
         * Sort the results in ascending order based on the _id field.
         *
         * Select only the items that should be displayed for a particular
         * page. For example, on the first page, only the first itemsPerPage
         * matching the query should be displayed.
         *
         * Use limit() and skip() and the method parameters: page and
         * itemsPerPage to select the appropriate matching products. Pass these
         * items to the callback function.
         *
         * searchItems() depends on a text index. Before implementing
         * this method, create a SINGLE text index on title, slogan, and
         * description. You should simply do this in the mongo shell.
         *
         */
          
		  
		  	 
		  var item_collection=this.db.collection('item');
		  
		  var find_query = "";
		  var number_of_items_to_skip = page * itemsPerPage;
		   
		  find_query = {$text:{$search:query}};
			  
		  item_collection.find(find_query)
		  .sort({_id:1})
		  .skip(number_of_items_to_skip)
		  .limit(itemsPerPage)
		  .toArray().then(function(result) {
		
			     callback(result);	
		   });
			  
		  
		  
		 
		 /*
        var item = this.createDummyItem();
        var items = [];
        for (var i=0; i<5; i++) {
            items.push(item);
        }*/
		

        // TODO-lab2A Replace all code above (in this method).

        // TODO Include the following line in the appropriate
        // place within your code to pass the items for the selected page
        // of search results to the callback.
        // callback(items);
    }


    this.getNumSearchItems = function(query, callback) {
        "use strict";

        var numItems = 0;

        /*
        * TODO-lab2B
        *
        * LAB #2B: Using the value of the query parameter passed to this
        * method, count the number of items in the "item" collection matching
        * a text search. Pass the count to the callback function.
        *
        * getNumSearchItems() depends on the same text index as searchItems().
        * Before implementing this method, ensure that you've already created
        * a SINGLE text index on title, slogan, and description. You should
        * simply do this in the mongo shell.
        */
		
   		  var item_collection=this.db.collection('item');
		  var find_query = "";
		  //var number_of_items_to_skip = page * itemsPerPage;
		   
		  find_query = {$text:{$search:query}};
			  
		  item_collection.find(find_query)
		  .sort({_id:1})
		  //.skip(number_of_items_to_skip)
		  //.limit(itemsPerPage)
		  .toArray().then(function(result) {
		         
			 numItems = result.length;
			 
			 console.log('calling getNumSearchItems value is ' + result.length);
							
				 //numItems = 2;
			     callback(result.length);	
		   });
		
		

       // callback(numItems);
    }


    this.getItem = function(itemId, callback) {
        "use strict";

        /*
         * TODO-lab3
         *
         * LAB #3: Implement the getItem() method.
         *
         * Using the itemId parameter, query the "item" collection by
         * _id and pass the matching item to the callback function.
         *
         */

          var item = this.createDummyItem();

	
		  var item_collection=this.db.collection('item');
		  var find_query = {"_id":itemId};
		   
		  //find_query = {$text:{$search:query}};
			  
		  item_collection.find(find_query)
		  //.sort({_id:1})
		  .toArray().then(function(result) 
		  {
			   var myitem = result[0];
			  
			   if(myitem.reviews == null)
			   {
			      myitem.reviews = [];
			      console.log('the reviews array is not empty .... ');
				 
			   }
			   
			   
			   console.log("What is my result from getItem function call :");
               console.log(myitem);
							   
		        //numItems = result.length;
			    
				console.log('What is the image url 1 ' + item.img_url);
				console.log('What is the image url 2 ' + myitem.img_url);
				
				
			    callback(myitem);	
				
		  });
		
				
        // TODO-lab3 Replace all code above (in this method).

        // TODO Include the following line in the appropriate
        // place within your code to pass the matching item
        // to the callback.
        //callback(item);
    }


    this.getRelatedItems = function(callback) {
        "use strict";

        this.db.collection("item").find({})
            .limit(4)
            .toArray(function(err, relatedItems) {
                assert.equal(null, err);
                callback(relatedItems);
            });
    };


    this.addReview = function(itemId, comment, name, stars, callback) {
        "use strict";

        /*
         * TODO-lab4
         *
         * LAB #4: Implement addReview().
         *
         * Using the itemId parameter, update the appropriate document in the
         * "item" collection with a new review. Reviews are stored as an
         * array value for the key "reviews". Each review has the fields:
         * "name", "comment", "stars", and "date".
         *
         */

        var reviewDoc = {
            name: name,
            comment: comment,
            stars: stars,
            date: Date.now()
        }

        // TODO replace the following two lines with your code that will
        // update the document with a new review.
        var doc = this.createDummyItem();
        doc.reviews = [reviewDoc];

		
        var item_collection=this.db.collection('item');
		//var update_query =  , {"$push":{"reviews":{"$each":[reviewDoc]}}}};
		    
		item_collection.updateOne({"_id":itemId} , {"$push":{"reviews":{"$each":[reviewDoc]}}} , function (err , results) {
			  
		     callback(reviewDoc);	
				
		});
 
		
        // TODO Include the following line in the appropriate
        // place within your code to pass the updated doc to the
        // callback.
        // callback(doc);
    }


    this.createDummyItem = function() {
        "use strict";

        var item = {
            _id: 1,
            title: "Gray Hooded Sweatshirt",
            description: "The top hooded sweatshirt we offer",
            slogan: "Made of 100% cotton",
            stars: 0,
            category: "Apparel",
            img_url: "/img/products/hoodie.jpg",
            price: 29.99,
            reviews: []
        };

        return item;
    }
}


module.exports.ItemDAO = ItemDAO;
