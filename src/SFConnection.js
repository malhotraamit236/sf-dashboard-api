const express = require('express');
const router = express.Router();
const session = require('express-session');
const jsforce = require('jsforce');
const config = require('./config');


const oauth2 = new jsforce.OAuth2({
    loginUrl : config.loginUrl,
    clientId : config.clientId,
    clientSecret : config.clientSecret,
    redirectUri : config.redirectUri
});

const conn = new jsforce.Connection({oauth2: oauth2});

router.get('/oauth2/login', function(req, res) {
    res.redirect(oauth2.getAuthorizationUrl({scope: 'api id web refresh_token'})+'&prompt=login%20consent');
});

router.get('/oauth2/callback', function(req, res){
    
    const code = req.query.code;
    
    conn.authorize(code, function(err, userInfo) {
        if (err) { 
            return console.error("This error is in the auth callback: " + err); 
        }
        req.session.accessToken = conn.accessToken;
        req.session.instanceUrl = conn.instanceUrl;
        req.session.refreshToken = conn.refreshToken;
        
        res.redirect('/loggedin');
    });
});

module.exports = {
    router: router,
    conn: conn,
    isAuthenticated: function (req, res, next) {
        if (req.session.accessToken){
            return next();
        }
        res.redirect('/');
    }
};