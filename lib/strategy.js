// Load modules.
var OAuthStrategy = require('passport-oauth1')
  , util = require('util')
  , uri = require('url')
  , V1Profile = require('./profile/v1')
  , V2Profile = require('./profile/v2')
  , InternalOAuthError = require('passport-oauth1').InternalOAuthError;


/**
 * `Strategy` constructor.
 *
 * The Bitbucket authentication strategy authenticates requests by delegating to
 * Bitbucket using the OAuth protocol.
 *
 * Applications must supply a `verify` callback which accepts a `token`,
 * `tokenSecret` and service-specific `profile`, and then calls the `cb`
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
 *       function(token, tokenSecret, profile, cb) {
 *         User.findOrCreate(..., function (err, user) {
 *           cb(err, user);
 *         });
 *       }
 *     ));
 *
 * @constructor
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
  this._userProfileURL = options.userProfileURL || 'https://api.bitbucket.org/2.0/user/';
  this._includeEmail = (options.includeEmail !== undefined) ? options.includeEmail : false;
  
  var url = uri.parse(this._userProfileURL);
  if (url.pathname.indexOf('/1.0/user/') == (url.pathname.length - '/1.0/user/'.length)) {
    this._userProfileFormat = '1.0';
  } else {
    this._userProfileFormat = '2.0';
  }
}

// Inherit from `OAuthStrategy`.
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
  var self = this;
  this._oauth.get(this._userProfileURL, token, tokenSecret, function (err, body, res) {
    var json;
    
    if (err) {
      if (!(err instanceof Error)) {
        return done(new Error('Failed to fetch user profile'));
      }
      return done(new InternalOAuthError('Failed to fetch user profile', err));
    }
    
    try {
      json = JSON.parse(body);
    } catch (ex) {
      return done(new Error('Failed to parse user profile'));
    }
    
    var profile;
    switch (self._userProfileFormat) {
    case '1.0':
      profile = V1Profile.parse(json);
      break;
    default: // 2.0
      profile = V2Profile.parse(json);
      break;
    }
    
    profile.provider = 'bitbucket';
    profile._raw = body;
    profile._json = json;
    
    if (self._includeEmail) {
      var url = self._userProfileFormat == '1.0' ? uri.resolve(self._userProfileURL, '../users/' + profile.username + '/emails') : uri.resolve(self._userProfileURL, 'emails');
      self._oauth.get(url, token, tokenSecret, function (err, body, res) {
        if (err) {
          // If the attempt to fetch email addresses fails, return the profile
          // information that was obtained.
          return done(null, profile);
        }
        
        var json;
        try {
          json = JSON.parse(body);
        } catch (_) {
          // If the attempt to parse email addresses fails, return the profile
          // information that was obtained.
          return done(null, profile);
        }
        
        if (self._userProfileFormat == '1.0') {
          if (!json.length) {
            return done(null, profile);
          }
          
          profile.emails = [];
          (json).forEach(function(email) {
            profile.emails.push({ value: email.email, primary: email.primary })
          });
        } else {
          if (!json.values || !json.values.length) {
            return done(null, profile);
          }
          
          profile.emails = [];
          (json.values).forEach(function(email) {
            profile.emails.push({ value: email.email, primary: email.is_primary, verified: email.is_confirmed })
          });
        }
        
        return done(null, profile);
      });
      
    } else {
      done(null, profile);
    }
  });
}

/**
 * Parse error response from Fitbit OAuth endpoint.
 *
 * @param {string} body
 * @param {number} status
 * @return {Error}
 * @access protected
 */
Strategy.prototype.parseErrorResponse = function(body, status) {
  if (typeof body === 'string') {
    if (body !== '') { return new Error(body); }
  }
};


// Expose constructor.
module.exports = Strategy;
