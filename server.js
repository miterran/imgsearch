const express = require('express');
const app = express();
const request = require('request');
var port = process.env.PORT || 8080;
var Bing = require('node-bing-api')({ accKey: "8d4fde2f6f2d4fb3957b35e2f6395823" });
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://test:test@ds157529.mlab.com:57529/webquery');
var urlSchema = new mongoose.Schema({
ip: String,
keyword: String,
when: String
})
var Urls = mongoose.model('imgquery', urlSchema);
app.get('/api/imagesearch/:item', function(req, res){
    var offset = req.query.offset;
    var filt = [];
    if(offset == undefined){
        offset = 0;
    }
    Bing.images(req.params.item, {top: 10, skip: offset}, function(error, request, body){
        var result = body['value']
        for(var i = 0; i < result.length; i++){
            var newObj = {'name': result[i]['name'], 'thumbnail': result[i]['thumbnailUrl'], 'link': result[i]['contentUrl'], 'display': result[i]['hostPageDisplayUrl']};
            filt.push(newObj);
        }
        Urls({ip: req.headers["x-forwarded-for"], keyword: req.params.item, when: Date()}).save().then(function(){
           res.send(filt); 
        });
      });
});
app.get('/api/latest/imagesearch', function(req, res){
    var savedRecord = [];
    Urls.find({}).limit(10).sort({$natural : -1}).then(function(result){
        for(var i = 0; i < result.length; i++){
            var newRecord = {'keyword': result[i]['keyword'], 'when': result[i]['when']};
            savedRecord.push(newRecord);
        };
        res.send(savedRecord);
    })
});
app.get('/', function(req, res){
    res.send('/api/imagesearch/ or /api/latest/imagesearch');
});
app.listen(port, function () {
  console.log('Example app listening on port 8080!')
})
