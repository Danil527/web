const express = require('express');
const ejs = require('ejs');
var bodyParser = require('body-parser');
const app = express();
const port = 3000;
const url = `mongodb://localhost/mydb`
const MongoClient = require('mongodb').MongoClient

app.set('view engine', 'html');
app.engine('html', ejs.renderFile)
app.use(express.static(__dirname + '/public'));
app.use(express.json());

app.get('/', function (req, res) {
  res.render('index.html')
});

app.get('/forms.html', function (req, res) {
  res.render('forms.html')
})

// for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));

// POST method route
app.post('/result', function (req, res) {
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    
    const dbo = db.db('mydb')
    dbo.collection('messages').insertOne(req.body, (err, res) => {
      if (err) throw err
    })
    dbo.collection("messages").find({}).toArray().then(data => {
      res.render('messages.ejs', {'data': data, 'keys': Object.keys})
      db.close()
    })

  })
});


app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});


MongoClient.connect(url, (err, db) => {
  if (err) throw err

  const dbo = db.db('mydb')

  dbo.collection('messages').deleteOne({'name': 'Nikita'}, (err, res) => {
    if (err) throw err
    console.log('Res: ', res)
    db.close()
  })
})


const chalk = require('chalk')

console.log(chalk.yellow('hello'))