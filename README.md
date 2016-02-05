**NOTICE:** Bitbucket supports both OAuth 1.0 and OAuth 2.0. This strategy
implements support for OAuth 1.0.  If you are building a new client, Bitbucket
strongly suggest using OAuth 2.0 as the preferred authentication method.  In
that case, [passport-bitbucket-oauth2](https://github.com/bithound/passport-bitbucket-oauth2)
can be used as a strategy.


# passport-bitbucket

[![Build](https://img.shields.io/travis/jaredhanson/passport-bitbucket.svg)](https://travis-ci.org/jaredhanson/passport-bitbucket)
[![Coverage](https://img.shields.io/coveralls/jaredhanson/passport-bitbucket.svg)](https://coveralls.io/r/jaredhanson/passport-bitbucket)
[![Quality](https://img.shields.io/codeclimate/github/jaredhanson/passport-bitbucket.svg?label=quality)](https://codeclimate.com/github/jaredhanson/passport-bitbucket)
[![Dependencies](https://img.shields.io/david/jaredhanson/passport-bitbucket.svg)](https://david-dm.org/jaredhanson/passport-bitbucket)


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

#### Create an Application

Before using `passport-bitbucket`, you must register an OAuth consumer with
Bitbucket. If you have not already done so, a new consumer can be created at
OAuth within Bitbucket's [settings panel](https://bitbucket.org/account/).
Your consumer will be issued a key and secret, which need to be provided to the
strategy.

#### Configure Strategy

The Bitbucket authentication strategy authenticates users using a Bitbucket
account and OAuth tokens.  The consumer key and consumer secret obtained when
creating an application are supplied as options when creating the strategy.  The
strategy also requires a `verify` callback, which receives the access token and
corresponding secret as arguments, as well as `profile` which contains the
authenticated user's Bitbucket profile.   The `verify` callback must call `cb`
providing a user to complete authentication.

    passport.use(new BitbucketStrategy({
        consumerKey: BITBUCKET_CONSUMER_KEY,
        consumerSecret: BITBUCKET_CONSUMER_SECRET,
        callbackURL: "http://127.0.0.1:3000/auth/bitbucket/callback"
      },
      function(token, tokenSecret, profile, cb) {
        User.findOrCreate({ bitbucketId: profile.username }, function (err, user) {
          return cb(err, user);
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

## Contributing

#### Tests

The test suite is located in the `test/` directory.  All new features are
expected to have corresponding test cases.  Ensure that the complete test suite
passes by executing:

```bash
$ make test
```

#### Coverage

All new feature development is expected to have test coverage.  Patches that
increse test coverage are happily accepted.  Coverage reports can be viewed by
executing:

```bash
$ make test-cov
$ make view-cov
```

## Support

#### Funding

This software is provided to you as open source, free of charge.  The time and
effort to develop and maintain this project is dedicated by [@jaredhanson](https://github.com/jaredhanson).
If you (or your employer) benefit from this project, please consider a financial
contribution.  Your contribution helps continue the efforts that produce this
and other open source software.

Funds are accepted via [PayPal](https://paypal.me/jaredhanson), [Venmo](https://venmo.com/jaredhanson),
and [other](http://jaredhanson.net/pay) methods.  Any amount is appreciated.

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2012-2016 Jared Hanson <[http://jaredhanson.net/](http://jaredhanson.net/)>
