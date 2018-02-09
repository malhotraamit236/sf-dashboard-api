const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const jsforce = require('jsforce');
const SFConnection = require('./src/SFConnection');
const GetAccounts = require('./src/routes/GetAccounts');
const axios = require('axios');

const app = express();

app.use(session({secret: 'S3CRE7', resave: true, saveUninitialized: true}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(SFConnection.router);
app.use(GetAccounts);

app.get('/loggedin', SFConnection.isAuthenticated, function(req, res){
    res.send('Authenticated');
});
app.get('/', function(req, res){
    res.send('Logged Out');
});
app.get('/logout', SFConnection.isAuthenticated, function(req, res){
    
    SFConnection.conn.logout().then(function(){
        axios.get(req.session.instanceUrl+'/secur/logout.jsp')
        .then(function(response){
            req.session.destroy();
            console.log('SESSION...', req.session);
        res.redirect('/');
        });
    });
    
    

});

app.listen(3000, function(req, res){
    console.log('Listening on 3000...');
});
