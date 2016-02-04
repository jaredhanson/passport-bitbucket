/**
 * Module dependencies.
 */
var OAuthStrategy = require('passport-oauth1')
  , util = require('util')
  , Profile = require('./profile')
  , InternalOAuthError = require('passport-oauth1').InternalOAuthError;


/**
 * `Strategy` constructor.
 *
 * The Bitbucket authentication strategy authenticates requests by delegating to
 * Bitbucket using the OAuth protocol.
 *
 * Applications must supply a `verify` callback which accepts a `token`,
 * `tokenSecret` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `consumerKey`     identifies client to Bitbucket
 *   - `consumerSecret`  secret used to establish ownership of the consumer key
 *   - `callbackURL`     URL to which Bitbucket will redirect the user after obtaining authorization
 *
 * Examples:
 *
 *     passport.use(new BitbucketStrategy({
 *         consumerKey: '123-456-789',
 *         consumerSecret: 'shhh-its-a-secret'
 *         callbackURL: 'https://www.example.net/auth/bitbucket/callback'
 *       },
 *       function(token, tokenSecret, profile, done) {
 *         User.findOrCreate(..., function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
  options = options || {};
  options.requestTokenURL = options.requestTokenURL || 'https://bitbucket.org/api/1.0/oauth/request_token/';
  options.accessTokenURL = options.accessTokenURL || 'https://bitbucket.org/api/1.0/oauth/access_token/';
  options.userAuthorizationURL = options.userAuthorizationURL || 'https://bitbucket.org/api/1.0/oauth/authenticate/';
  options.sessionKey = options.sessionKey || 'oauth:bitbucket';

  OAuthStrategy.call(this, options, verify);
  this.name = 'bitbucket';
}

/**
 * Inherit from `OAuthStrategy`.
 */
util.inherits(Strategy, OAuthStrategy);

/**
 * Retrieve user profile from Bitbucket.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `displayName`
 *
 * @param {String} token
 * @param {String} tokenSecret
 * @param {Object} params
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function(token, tokenSecret, params, done) {
  this._oauth.get('https://api.bitbucket.org/1.0/user/', token, tokenSecret, function (err, body, res) {
    var json;
    
    if (err) { return done(new InternalOAuthError('Failed to fetch user profile', err)); }
    
    try {
      json = JSON.parse(body);
    } catch (ex) {
      return done(new Error('Failed to parse user profile'));
    }
    
    var profile = Profile.parse(json);
    profile.provider = 'bitbucket';
    profile._raw = body;
    profile._json = json;
    
    done(null, profile);
  });
}


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
