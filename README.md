# Passport-Bitbucket

[Passport](https://github.com/jaredhanson/passport) strategy for authenticating
with [Bitbucket](https://bitbucket.org/) using the OAuth 1.0a API.

This module lets you authenticate using Bitbucket in your Node.js applications.
By plugging into Passport, Bitbucket authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Install

    $ npm install passport-bitbucket

## Usage

#### Configure Strategy

The Bitbucket authentication strategy authenticates users using a Bitbucket
account and OAuth tokens.  The strategy requires a `verify` callback, which
accepts these credentials and calls `done` providing a user, as well as
`options` specifying a consumer key, consumer secret, and callback URL.

    passport.use(new BitbucketStrategy({
        consumerKey: BITBUCKET_CONSUMER_KEY,
        consumerSecret: BITBUCKET_CONSUMER_SECRET,
        callbackURL: "http://127.0.0.1:3000/auth/bitbucket/callback"
      },
      function(token, tokenSecret, profile, done) {
        User.findOrCreate({ bitbucketId: profile.username }, function (err, user) {
          return done(err, user);
        });
      }
    ));

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'bitbucket'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

    app.get('/auth/bitbucket',
      passport.authenticate('bitbucket'));

    app.get('/auth/bitbucket/callback', 
      passport.authenticate('bitbucket', { failureRedirect: '/login' }),
      function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
      });

## Examples

Developers using the popular [Express](http://expressjs.com/) web framework can
refer to an [example](https://github.com/passport/express-4.x-twitter-example)
as a starting point for their own web applications.  The example shows how to
authenticate users using Twitter.  However, because both Twitter and Bitbucket
use OAuth 1.0, the code is similar.  Simply replace references to Twitter with
corresponding references to Bitbucket.

## Tests

    $ npm install --dev
    $ make test

[![Build Status](https://secure.travis-ci.org/jaredhanson/passport-bitbucket.png)](http://travis-ci.org/jaredhanson/passport-bitbucket)

## Credits

  - [Jared Hanson](http://github.com/jaredhanson)

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2012-2013 Jared Hanson <[http://jaredhanson.net/](http://jaredhanson.net/)>
