var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
// var config = require ('./scripts/config');
// var models = require ('./scripts/models');
var querystring = require('querystring');
var PORT = process.env.PORT;
var emailPassword = process.env.PASSWORD;
var Yelp= require('yelp');
// var DB = config.DB;
var searchResults;

var yelp = new Yelp({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  token: process.env.TOKEN,
  token_secret: process.env.TOKEN_SECRET
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static('./'));
app.use('/static', express.static(__dirname + '/happy_hour'));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function(req, res) {
  res.sendFile('index.html', {root:__dirname + '/'});
});

app.get('/about/', function(req, res) {
  res.sendFile('index.html', {root:__dirname + '/'});
});

app.get('/new-edit/', function(req, res) {
  res.sendFile('index.html', {root:__dirname + '/'});
});

app.get('/search/', function(req, res) {
  res.sendFile('index.html', {root:__dirname + '/'});
});

app.get("/search/:usersearch", function(req, res){
  res.sendFile('index.html', {root:__dirname + '/'});
});

app.post('/resultsMore',function(req,res){
  // console.log(req.body.searchCrit);
  userSearchReq = req.body.searchCrit;
  console.log(userSearchReq);
  if(userSearchReq.reqNeighborhood===undefined){
    // var sw_latitude = userSearchReq.currectLoc.lat- 0.024;
    // var ne_latitude = Number(userSearchReq.currectLoc.lat) + 0.024;
    // var sw_longitude = userSearchReq.currectLoc.long - 0.024;
    // var ne_longitude = Number(userSearchReq.currectLoc.long) + 0.024;
    console.log(userSearchReq.moreSearch.sw_latitude +', '+userSearchReq.moreSearch.ne_latitude+', '+userSearchReq.moreSearch.sw_longitude+', '+userSearchReq.moreSearch.ne_longitude);
    yelp.search(
      {
        term:'happy hour '+ userSearchReq.terms,
        // ll:userSearchReq.currectLoc,
        bounds: userSearchReq.moreSearch.sw_latitude+','+userSearchReq.moreSearch.sw_longitude+'|'+userSearchReq.moreSearch.ne_latitude+','+userSearchReq.moreSearch.ne_longitude,
        limit:20
      }).then(function(data){
        // data.businesses.forEach(function(each) {
        //   console.log(each.id);
        // });
      // console.log(data.businesses);
      searchResults=data.businesses;
      res.send(searchResults);
    }).catch(function(error){
      res.send(error);
      console.log(error);
    });
  }
  else{
    yelp.search(
      {
        term:'happy hour '+ userSearchReq.terms,
        location:userSearchReq.reqNeighborhood +' SEATTLE',
        cll:userSearchReq.currectLoc||"47.6097,-122.3331",
        limit:20
    }).then(function(data){
    console.log(data.businesses);
    searchResults=data.businesses;
    res.send(searchResults);
  }).catch(function(error){
    res.send(error);
    console.log(error);
  });
  }
});

app.post('/search',function(req,res){
  // console.log(req.body.searchCrit);
  userSearchReq = req.body.searchCrit;
  console.log(userSearchReq);
  var searchString = querystring.stringify({terms:userSearchReq.terms, reqNeighborhood:userSearchReq.reqNeighborhood, currectLoc:userSearchReq.currectLoc.lat+','+userSearchReq.currectLoc.long});
  // console.log('the string:');
  console.log(searchString);
  if(userSearchReq.reqNeighborhood===undefined){
    console.log(userSearchReq.currectLoc);
    var sw_latitude = userSearchReq.currectLoc.lat- 0.012;
    var ne_latitude = Number(userSearchReq.currectLoc.lat) + 0.012;
    var sw_longitude = userSearchReq.currectLoc.long - 0.012;
    var ne_longitude = Number(userSearchReq.currectLoc.long) + 0.012;
    console.log(sw_latitude+", "+ne_latitude +", "+sw_longitude +", "+ne_longitude);
    yelp.search(
      {
        term:'happy hour '+ userSearchReq.terms,
        // ll:userSearchReq.currectLoc||"47.6097,-122.3331",
        bounds: sw_latitude+','+sw_longitude+'|'+ne_latitude+','+ne_longitude,
        limit:20
      }).then(function(data){
      console.log(data);
      searchResults = { yelp :data.businesses, url: searchString};
      res.send(searchResults);
    }).catch(function(error){
      res.send(error);
      console.log(error);
    });
  }

  else{
    console.log('121');
    console.log(userSearchReq);
    yelp.search(
      {
        term:'happy hour '+ userSearchReq.terms,
        location:userSearchReq.reqNeighborhood +' SEATTLE',
        cll:userSearchReq.currectLoc.lat +', '+ userSearchReq.currectLoc.long ||"47.6097,-122.3331",
        limit:20
    }).then(function(data){
    // console.log(data.businesses);
    searchResults = { yelp :data.businesses, url: searchString};
    res.send(searchResults);
  }).catch(function(error){
    res.send(error);
    console.log(error);
  });
  }
});

app.post('/locationUpdate', function (req, res) {
  // console.log(req.body.update);
  var newLocation = req.body.update;
  var mailOpts, smtpTrans;
  var newLocationYelpIds = [];
  var stringID;
  //Setup Nodemailer transport, I chose gmail. Create an application-specific password to avoid problems.
  smtpTrans = nodemailer.createTransport('SMTP', {
      service: 'Gmail',
      auth: {
          user: "cddesignsmailer@gmail.com",
          pass: emailPassword
      }
  });
  yelp.search(
    {
      term:'happy hour '+ newLocation.name,
      location:'SEATTLE',
      cll:"47.6097,-122.3331",
      limit:10
  }).then(function(data){
    data.businesses.forEach(function(each) {
      newLocationYelpIds.push({name:each.name,id:each.id});
      if (data.businesses.length === newLocationYelpIds.length) {
        stringID = 'Possible Yelp IDs: <br>'+ JSON.stringify(newLocationYelpIds);
        sendEmail();
      }
    });
    // console.log(newLocationYelpIds);
}).catch(function(error){
  res.send(error);
  console.log(error);
});

  //Mail options
  var hours = '';
  var stringObject = 'hours: <br>'+ JSON.stringify(newLocation.hours);
  // console.log(stringObject);
  function sendEmail() {
    mailOpts = {
        from: 'Drink Up Seattle Mailer',
        to: 'Berning.corey@gmail.com',
        subject: 'Drink Up Seattle Location Update',
        html: newLocation.name + '<br><br>' + stringObject + '<br><br>' + stringID
    };
    smtpTrans.sendMail(mailOpts, function (error, response) {
        //Email not sent
        if (error) {
          console.log(error);
          var data = {
            message: 'Sorry, but there was an issue sending your information. Please try resending '+newLocation.name+ ' information again.',
            flag: false
          };
          res.send(data);
        }
        //Yay!! Email sent
        else {
          var data = {
            message: 'Your updated information for '+newLocation.name+' has been sent and we will update our database. Thank you for helping update DrinkUpSeattle.com.',
            flag: true
          };
          console.log('sent');
          res.send(data);
        }
    });
  }
});

// app.post('/resultsMore',function(req,res){
//   // console.log(req.body.searchCrit);
//   userSearchReq = req.body.searchCrit;
//   console.log(userSearchReq);
//   if(userSearchReq.reqNeighborhood===""){
//     yelp.search({term:'happy hour '+ userSearchReq.terms,ll:userSearchReq.currectLoc,limit:20}).then(function(data){
//       console.log(data.businesses);
//       searchResults=data.businesses;
//       res.send(searchResults);
//     }).catch(function(error){
//       res.send(error);
//       console.log(error);
//     });
//   }
//   else{
//   yelp.search({term:'happy hour '+ userSearchReq.terms,location:userSearchReq.reqNeighborhood,cll:userSearchReq.currectLoc,limit:20}).then(function(data){
//     console.log(data.businesses);
//     searchResults=data.businesses;
//     res.send(searchResults);
//   }).catch(function(error){
//     res.send(error);
//     console.log(error);
//   });
//   }
// });



app.listen(PORT,function(){
  console.log('server started');
});
