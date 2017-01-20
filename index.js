var pg = require('pg');
var express = require ('express');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');
app.set('views','./views');

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.redirect('/home');
})

app.get('/home', function(req, res){
  pg.connect('postgres://localhost:5432/bulletin_board', function(err, client, done){
      res.render('home');
      done();
      pg.end();
    })
  })


app.get('/messages', function(req,res){
  pg.connect('postgres://localhost:5432/bulletin_board', function(err, client, done){
    client.query('select * from messages', function(err, result){
      res.render('messages', { data: result.rows});
      console.log(result.rows)
      done();
      pg.end();
    })
  })
})

app.get('/messages/:id', function(req, res){
  pg.connect('postgres://localhost:5432/bulletin_board', function(err, client, done){
    var message_id = req.params.id;
    console.log(message_id);
    client.query(`select * from messages where id = '${message_id}'`, function (err, result){
      res.render('show', { message : result.rows[0]});
      console.log(result.rows[0]);
      done();
      pg.end();
    })
  })
})

app.post('/messages', function(req,res){
  pg.connect('postgres://localhost:5432/bulletin_board', function(err, client, done){
    client.query (`insert into messages(title,body) values('${req.body.title}','${req.body.body}')`, function(err, result){
      console.log(err);

      res.redirect('/messages');
      done();
      pg.end();
    })
  })

})

app.listen(3000, function(){
  console.log("Listening on port 3000")
})
