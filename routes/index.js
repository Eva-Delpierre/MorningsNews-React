var express = require('express');
var router = express.Router();
var userModel = require('../models/users');
var articleModel = require('../models/articles');
var uid2 = require("uid2");

var SHA256 = require('crypto-js/sha256');
var encBase64 = require('crypto-js/enc-base64');

/* GET home page. */

router.post('/sign-up', async function(req, res, next) { 
var saveUser = null;
var result = false;
var error = [];
var token = null;

var userSearch = await userModel.findOne({
  email: req.body.emailFromFront
})

if(req.body.nameFromFront === "" || req.body.emailFromFront === "" || req.body.passwordFromFront === "") {
  error.push("Veuillez remplir tous les champs de saisie")
}


if(userSearch != null){
  error.push("Email déjà utilisé")
} 

if(error.length == 0) {
    var salt = uid2(32);
    var newUser = new userModel({
      name: req.body.nameFromFront,
      email: req.body.emailFromFront,
      salt : salt,
      password: SHA256(req.body.passwordFromFront + salt).toString(encBase64),
      token : uid2(32)
    });

    saveUser = newUser.save();

    if(saveUser){
      result = true;
      token = saveUser.token
    }

}
 

  res.json({result, saveUser, error, token})

})

router.post('/sign-in',  async function(req, res, next) {
  var result = false;
  var error = [];
  var token = null;
  var user = null;

  if(req.body.emailFromFront == "" || req.body.passwordFromFront == ""){
    error.push("Veuillez remplir tous les champs de saisie")
  }


  if(error.length == 0){
    var user = await userModel.findOne({
      email : req.body.emailFromFront,
    })
  
    if(user){
      var mdpCrypt = SHA256(req.body.passwordFromFront + user.salt).toString(encBase64);
  
      if(mdpCrypt== user.password){
        result = true;
        token = user.token 
      } else {
        result = false;
        error.push('Mot de passe incorrect')
      }
    } else {
      error.push('email incorrect')
    }

  }

  res.json({result, user, error, token})
})

router.post('/wishlist-article', async function (req, res, next) {
  var result = false;

  var user = await userModel.findOne({token: req.body.token})

  if(user != null){
    var newArticle = await articleModel({
      title: req.body.name,
      description: req.body.desc,
      urlToImage: req.body.img,
      content: req.body.content,
      lang: req.body.lang ,
      userId: user._id
    })
    var articleSave = await newArticle.save();

    if(articleSave.name){
      result = true;
    }
  }
  res.json({result});
})

router.delete('/wishlist-article', async function(req, res, next) {
  var result = false;
  var user = await userModel.findOne({token: req.body.token})


  if(user){
    var articleSupp = await articleModel.deleteOne({title: req.body.title, userId: user._id})
  }

  if(articleSupp.deletedCount == 1){
    result = true;
  }

  res.json({result})
})

router.get('/wishlist-article', async function(req, res, next) {
  var articles = [];
  var user = await userModel.findOne({token: req.query.token})

  if(user){
    if(req.query.lang !== ''){
      articles = await articleModel.find({userId: user._id, lang: req.query.lang})
    } else {
      articles = await articleModel.find({userId: user._id})
    }
  }

  res.json({articles})
})

router.get('/user-lang', async function(req, res, next) {
  var lang = null;
  var user = await userModel.findOne({token: req.query.token})

  if(user){
    lang = user.lang;
  }

  res.json({lang})
})

router.post('/user-lang', async function(req, res, next) {
  var result = false;
  var user = await userModel.updateOne({token: req.body.token}, {lang: req.body.lang})

  if(user){
    result = true;
  }

  res.json({result})
})


module.exports = router;
