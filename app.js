const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 5000;

const User = require('./models/users');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://boot:yzrMBEwwBEKR2NoZ@cluster0-bkpdt.azure.mongodb.net/test?retryWrites=true&w=majority')
    .then(() => {
        console.log('Goodjob you\'re connected to mongodb');
    })
    .catch((error) => {
        console.log('Unable to connect to mongodb');
        console.log(error);
    });

app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to the API'
  });
});

app.get('/api/:pseudo',(req,res) => {
    User.find({ pseudo: req.params.pseudo }).then(result => {
        res.json({
            authData
        })
        }).catch( err => {
            res.status(404).json({
            error: err
        })
    })
})

app.delete("/api/:pseudo", (req, res, next) => {
    User.remove({ pseudo: req.params.pseudo })
      .exec().then(result => {
        res.status(200).json({
          message: "User deleted"
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  });


app.use('/', require('./routes/index.js'));
// app.use('/users', require('./routes/users.js'));

app.post('/api/posts', verifyToken, (req, res) => {
    jwt.verify(req.token, 'key', (err, authData) => {
        if(err){
            res.sendStatus(403);
        }else{
            res.json({
                message: 'Post created',
                authData
            });
        }
    })

});

app.post('/api/login', (req, res) => {
    // const user = new User({
    //     pseudo,
    //     password
    // })
    jwt.sign({user}, 'key', (err, token) => {
        res.json({
            token
        });
    });
});

app.post('/api/signup', (req,res,next) => {
    User.find({ pseudo: req.body.pseudo }).exec().then(user =>{
        if(user.length >= 1){
            return res.status(409).json({
                message: "This pseudonyme is already taken."
            })
        }else{
            const user = new User({
                _id: new mongoose.Types.ObjectId(),
                pseudo: req.body.pseudo,
                password: req.body.password
            })
            jwt.sign({user}, 'key', (err, token) => {
                res.json({
                    token
                });
            });
            user.save();
        }
    })
    
}); 

function verifyToken(req, res, next){
    const header = req.headers['authorization'];
    if(typeof(header) !== 'undefined'){
        const bearer = header.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    }else{
        res.sendStatus(403)
    }
}

app.listen(PORT, console.log(`Server on http://localhost:${PORT}`));

