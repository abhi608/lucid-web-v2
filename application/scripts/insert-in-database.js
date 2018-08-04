var fs = require('fs');
var async = require('async')
var mongoose = require('mongoose');
var mongoosastic = require('mongoosastic');
var Schema = mongoose.Schema;

var Relatedqs = new Schema({
	value: String,
	formInput: String
});

var Covers = new Schema({
	tid: Number,
	title: String
});

var CitedbyList = new Schema({
	tid: String,
	url: String,
	title: String
});

var Loogal = new Schema({
	numcites: Number,
	covertids: [Number],
	covertitles: [String],
	relatedqs: [Relatedqs],
	firstname: String,
	title: String,
	url: String,
	lastname: String,
	secondname: String,
	publishdate: String,
	citedbyList: [CitedbyList],
	covers: [Covers],
	docsource: String,
	numcitedby: Number,
	divtype: String,
	doc: String,
	keywords: [String],
	tid: Number,
	pageRank: Number,
	showurl: Boolean,
	citeList: [CitedbyList]
});

var list = ['numcities', 'covertids', 'covertitles', 'relatedqs', 'firstname', 'title', 'url', 'lastname', 'secondname', 'publishdate',
			'citedbyList', 'covers', 'docsource', 'numcitedby', 'divtype', 'doc', 'keywords', 'tid', 'pageRank', 'showurl', 'citeList'];

// Relatedqs.plugin(mongoosastic);
// Covers.plugin(mongoosastic);
// CitedbyList.plugin(mongoosastic);
Loogal.plugin(mongoosastic, {
	hosts: ['0.0.0.0:9200']
});

var uri = 'mongodb://0.0.0.0/pagerank'
var options = {
	useMongoClient: true,
  	connectTimeoutMS: 2000
}

mongoose.connect(uri, options, function(error) {
	// Check error in initial connection. There is no 2nd param to the callback.
	if(error){
		console.error(error);
	}
	else{
		console.log("Connected to mongodb client successfully!")
		var Collection = mongoose.model('pagerank', Loogal);
		async.times(142, function(l, nextOne){
			var i = l+1;
			fs.readFile('../pageRank/page_' + JSON.stringify(i) + '.json', function(err, res){
				if(err){
					console.error(err);
				}
				else{
					console.log("Successfully read file- ../pageRank/page_" + JSON.stringify(i) + ".json")
					data = JSON.parse(res);
					var len = data.length;
					async.times(len, function(j, next){
						// curData = data[j]; // json object - a singlle doc
						var obj = data[j];
						for(var k=0; k<list.length; k++){
							if(!(list[k] in obj)){
								obj[list[k]] = null;
							}
						}
						var docu = new Collection(obj);
						docu.save(function(e, resp){
							if(e){
								console.error(e);
							}
							else{
								console.log("data inserted successfully", obj["tid"]);
								next(e, resp);
							}
						});
						
					}, function(e, resp){
						if(e){
							console.error(e);
						}
						else{
							console.log("All records inserted successfully of page", i);
							nextOne(e, resp);
						}
					});
				}
			});
		}, function(e, resp){
			if(e){
				console.error(e);
			}
			else{
				console.log("All records inserted successfully!");
			}
		});
	}
});


