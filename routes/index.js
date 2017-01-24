const express = require('express');
const router = express.Router();

const imgur = require('../services/imgur');



var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = process.env.IMAGESEARCH_URL; 




router.get('/', (req, res) => {
	res.send('https://fast-everglades-24979.herokuapp.com/search/<search_item>?offset=10 --- https://fast-everglades-24979.herokuapp.com/latest');
});

router.get('/latest', (req, res) => {
	//var resJson = {Test:"test"};
	
	MongoClient.connect(url, function(err, db) {
		if(err) {
			console.log("Unable to connect to DB", err);		
		} else {
			console.log("Connected to DB");	
			var theCurser = db.collection("collection").find();
			theCurser.toArray(function(err, doc) {
				if(err) {
					console.log(err);				
				} else {
					var resJson = doc;
					res.json(resJson);					
				}
			});
			
		}
		
		//var theCurser = db.collection('collection').find({}, function() {
				//res.json({"Test":"test"});
		//});
		
		//res.json({"Test":"test"});
		
		//res.json(resJson);
		
	});
	//res.json(results);	
	//res.send('Hello');
	
});

router.get('/search/:q', (req, res) => {
	imgur.getImage(req.params.q, req.query.offset).then(ans => {
		//try req.query.q
		console.log(req.params);
		//console.log(req.query.offset);
		//var param = req.params.q;		
		var storeUrl = 'https://fast-everglades-24979.herokuapp.com/' + req.params.q + '?offset=' + req.query.offset;
		var d = new Date();
		var storeJson = {
			'URL':storeUrl,
			'time':d.getTime().toString()		
		}
		MongoClient.connect(url, function(err, db) {
			if(err) {
				console.log("Unable to connect to DB", err);			
			} else {
				console.log("Connected to DB");			
			}
			db.collection("collection").insert(storeJson);
		});
		
		res.json(ans);
		
	});
});

module.exports = router;