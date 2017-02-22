const express = require('express');
const app = express();
const request = require('request');
var port = process.env.PORT || 8080;
// const mongoose = require('mongoose');
// mongoose.Promise = global.Promise;
//mongoose.connect('https://cryptic-ridge-9197.herokuapp.com/api/imagesearch/dog');




app.get('/api/imagesearch/:item', function(req, res){
    request('https://cryptic-ridge-9197.herokuapp.com/api/imagesearch/' + req.params.item, function(error, data){
        res.send(data['body']);
    })
});

app.get('/api/latest/imagesearch', function(req, res){
    request('https://cryptic-ridge-9197.herokuapp.com/api/latest/imagesearch/', function(error, data){
        res.send(data['body']);
    })
});

app.get('/', function(req, res){
    res.send('/api/imagesearch/ or /api/latest/imagesearch');
});

app.listen(port, function () {
  console.log('Example app listening on port 8080!')
})
