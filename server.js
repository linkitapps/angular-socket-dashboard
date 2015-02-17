var fs = require('fs');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static(__dirname + '/public'));
app.use('/data',  express.static(__dirname + '/data'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

app.get('/retrieveData', function(req, res) {
  fs.readFile(__dirname + '/data/chartData.json', 'utf8', function (err,data) {
    if (err) {
      return console.log('retrive', err);
    }
    res.send(data);
  });
});

app.post('/updateData', function (req, res) {
  if (req.body) {
    var data = JSON.stringify(req.body);

    if (data) {
      fs.writeFile(__dirname + '/data/chartData.json', data, function(err) {
        console.log('update', err);
      });
    }
  }
});

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

// 차트 데이터 업데이트 on/emit
io.on('connection', function(socket){
  socket.on('chartData update', function(data){
    socket.broadcast.emit('chartData update', {chartId: data.chartId, data: data.data});
  });
});

http.listen(3000, function() {
  console.log('listening on *:3000');
});