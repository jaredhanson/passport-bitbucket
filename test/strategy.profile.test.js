var BitbucketStrategy = require('../lib/strategy')
  , fs = require('fs');


describe('Strategy#userProfile', function() {
  
  describe('fetched from API version 2 (default) endpoint', function() {
    var strategy = new BitbucketStrategy({
      consumerKey: 'ABC123',
      consumerSecret: 'secret'
    }, function verify(){});
    
    strategy._oauth.get = function(url, token, tokenSecret, callback) {
      if (url != 'https://api.bitbucket.org/2.0/user/') { return callback(new Error('incorrect url argument')); }
      if (token != 'token') { return callback(new Error('incorrect token argument')); }
      if (tokenSecret != 'token-secret') { return callback(new Error('incorrect tokenSecret argument')); }
    
      var body = require('fs').readFileSync('test/fixtures/2.0/jaredhanson.json', 'utf8');
      callback(null, body, undefined);
    }
    
    
    var profile;
  
    before(function(done) {
      strategy.userProfile('token', 'token-secret', {}, function(err, p) {
        if (err) { return done(err); }
        profile = p;
        done();
      });
    });
  
    it('should parse profile', function() {
      expect(profile.provider).to.equal('bitbucket');
      expect(profile.id).to.equal('{76f43b39-9405-4ca8-9464-ef5aff1ab130}');
      expect(profile.username).to.equal('jaredhanson');
      expect(profile.displayName).to.equal('Jared Hanson');
    });
  
    it('should set raw property', function() {
      expect(profile._raw).to.be.a('string');
    });
  
    it('should set json property', function() {
      expect(profile._json).to.be.an('object');
    });
  }); // fetched from API version 2 (default) endpoint
  
  describe('fetched from API version 2 (default) endpoint and then fetching emails', function() {
    var strategy =  new BitbucketStrategy({
      consumerKey: 'ABC123',
      consumerSecret: 'secret',
      includeEmail: true
    }, function() {});
  
    strategy._oauth.get = function(url, token, tokenSecret, callback) {
      var body;
      switch (url) {
      case 'https://api.bitbucket.org/2.0/user/':
        body = require('fs').readFileSync('test/fixtures/2.0/jaredhanson.json', 'utf8');
        break;
      case 'https://api.bitbucket.org/2.0/user/emails':
        body = '{"pagelen": 10, "values": [{"is_primary": true, "is_confirmed": true, "type": "email", "email": "test@gmail.com", "links": {"self": {"href": "https://api.bitbucket.org/2.0/user/emails/test@gmail.com"}}}, {"is_primary": false, "is_confirmed": true, "type": "email", "email": "hello@sifteo.com", "links": {"self": {"href": "https://api.bitbucket.org/2.0/user/emails/hello@sifteo.com"}}}], "page": 1, "size": 2}';
        break;
      default:
        return callback(new Error('wrong url argument'));
      }
      callback(null, body, undefined);
    };
    
    
    var profile;
    
    before(function(done) {
      strategy.userProfile('token', 'token-secret', {}, function(err, p) {
        if (err) { return done(err); }
        profile = p;
        done();
      });
    });
    
    it('should parse profile', function() {
      expect(profile.provider).to.equal('bitbucket');
      expect(profile.id).to.equal('{76f43b39-9405-4ca8-9464-ef5aff1ab130}');
      expect(profile.username).to.equal('jaredhanson');
      expect(profile.displayName).to.equal('Jared Hanson');
      expect(profile.emails).to.have.length(2);
      expect(profile.emails[0].value).to.equal('test@gmail.com');
      expect(profile.emails[0].primary).to.equal(true);
      expect(profile.emails[0].verified).to.equal(true);
      expect(profile.emails[1].value).to.equal('hello@sifteo.com');
      expect(profile.emails[1].primary).to.equal(false);
      expect(profile.emails[1].verified).to.equal(true);
    });
    
    it('should set raw property', function() {
      expect(profile._raw).to.be.a('string');
    });
    
    it('should set json property', function() {
      expect(profile._json).to.be.an('object');
    });
  }); // fetched from API version 2 (default) endpoint and then fetching emails
  
  describe('fetched from API version 1 endpoint', function() {
    var strategy = new BitbucketStrategy({
      consumerKey: 'ABC123',
      consumerSecret: 'secret',
      userProfileURL: 'https://api.bitbucket.org/1.0/user/'
    }, function verify(){});
    
    strategy._oauth.get = function(url, token, tokenSecret, callback) {
      if (url != 'https://api.bitbucket.org/1.0/user/') { return callback(new Error('incorrect url argument')); }
      if (token != 'token') { return callback(new Error('incorrect token argument')); }
      if (tokenSecret != 'token-secret') { return callback(new Error('incorrect tokenSecret argument')); }
    
      var body = '{ \
          "repositories": [ \
            { \
                "scm": "git", \
                "has_wiki": false, \
                "last_updated": "2012-01-09 06:12:36", \
                "created_on": "2012-01-09 06:11:25", \
                "owner": "jaredhanson", \
                "logo": null, \
                "email_mailinglist": "", \
                "is_mq": false, \
                "size": 2515, \
                "read_only": false, \
                "fork_of": null, \
                "mq_of": null, \
                "state": "available", \
                "utc_created_on": "2012-01-09 05:11:25+00:00", \
                "website": "", \
                "description": "Secret project.", \
                "has_issues": false, \
                "is_fork": false, \
                "slug": "secret", \
                "is_private": true, \
                "name": "secret", \
                "language": "", \
                "utc_last_updated": "2012-01-09 05:12:36+00:00", \
                "email_writers": true, \
                "main_branch": "master", \
                "no_public_forks": false, \
                "resource_uri": "/api/1.0/repositories/jaredhanson/secret" \
            }, \
            { \
                "scm": "git", \
                "has_wiki": false, \
                "last_updated": "2012-01-12 08:46:02", \
                "created_on": "2011-12-15 01:03:27", \
                "owner": "jaredhanson", \
                "logo": null, \
                "email_mailinglist": "", \
                "is_mq": false, \
                "size": 99600, \
                "read_only": false, \
                "fork_of": null, \
                "mq_of": null, \
                "state": "available", \
                "utc_created_on": "2011-12-15 00:03:27+00:00", \
                "website": "", \
                "description": "Super secret project.", \
                "has_issues": false, \
                "is_fork": false, \
                "slug": "super-secret", \
                "is_private": true, \
                "name": "super-secret", \
                "language": "", \
                "utc_last_updated": "2012-01-12 07:46:02+00:00", \
                "email_writers": true, \
                "main_branch": "master", \
                "no_public_forks": false, \
                "resource_uri": "/api/1.0/repositories/jaredhanson/super-secret" \
            } \
          ], \
          "user": { \
              "username": "jaredhanson", \
              "first_name": "Jared", \
              "last_name": "Hanson", \
              "avatar": "https://secure.gravatar.com/avatar/6c43616eef331e8ad08c7f90a51069a5?d=identicon&s=32", \
              "resource_uri": "/1.0/users/jaredhanson" \
          } \
      }';
      callback(null, body, undefined);
    }
    
    
    var profile;
  
    before(function(done) {
      strategy.userProfile('token', 'token-secret', {}, function(err, p) {
        if (err) { return done(err); }
        profile = p;
        done();
      });
    });
  
    it('should parse profile', function() {
      expect(profile.provider).to.equal('bitbucket');
      expect(profile.id).to.be.undefined;
      expect(profile.username).to.equal('jaredhanson');
      expect(profile.displayName).to.equal('Jared Hanson');
      expect(profile.name.familyName).to.equal('Hanson');
      expect(profile.name.givenName).to.equal('Jared');
    });
  
    it('should set raw property', function() {
      expect(profile._raw).to.be.a('string');
    });
  
    it('should set json property', function() {
      expect(profile._json).to.be.an('object');
    });
  }); // fetched from API version 1 endpoint
  
  describe('fetched from API version 1 endpoint and then fetching emails', function() {
    var strategy =  new BitbucketStrategy({
      consumerKey: 'ABC123',
      consumerSecret: 'secret',
      userProfileURL: 'https://api.bitbucket.org/1.0/user/',
      includeEmail: true
    }, function() {});
  
    strategy._oauth.get = function(url, token, tokenSecret, callback) {
      var body;
      switch (url) {
      case 'https://api.bitbucket.org/1.0/user/':
        body = '{ \
            "repositories": [ \
              { \
                  "scm": "git", \
                  "has_wiki": false, \
                  "last_updated": "2012-01-09 06:12:36", \
                  "created_on": "2012-01-09 06:11:25", \
                  "owner": "jaredhanson", \
                  "logo": null, \
                  "email_mailinglist": "", \
                  "is_mq": false, \
                  "size": 2515, \
                  "read_only": false, \
                  "fork_of": null, \
                  "mq_of": null, \
                  "state": "available", \
                  "utc_created_on": "2012-01-09 05:11:25+00:00", \
                  "website": "", \
                  "description": "Secret project.", \
                  "has_issues": false, \
                  "is_fork": false, \
                  "slug": "secret", \
                  "is_private": true, \
                  "name": "secret", \
                  "language": "", \
                  "utc_last_updated": "2012-01-09 05:12:36+00:00", \
                  "email_writers": true, \
                  "main_branch": "master", \
                  "no_public_forks": false, \
                  "resource_uri": "/api/1.0/repositories/jaredhanson/secret" \
              }, \
              { \
                  "scm": "git", \
                  "has_wiki": false, \
                  "last_updated": "2012-01-12 08:46:02", \
                  "created_on": "2011-12-15 01:03:27", \
                  "owner": "jaredhanson", \
                  "logo": null, \
                  "email_mailinglist": "", \
                  "is_mq": false, \
                  "size": 99600, \
                  "read_only": false, \
                  "fork_of": null, \
                  "mq_of": null, \
                  "state": "available", \
                  "utc_created_on": "2011-12-15 00:03:27+00:00", \
                  "website": "", \
                  "description": "Super secret project.", \
                  "has_issues": false, \
                  "is_fork": false, \
                  "slug": "super-secret", \
                  "is_private": true, \
                  "name": "super-secret", \
                  "language": "", \
                  "utc_last_updated": "2012-01-12 07:46:02+00:00", \
                  "email_writers": true, \
                  "main_branch": "master", \
                  "no_public_forks": false, \
                  "resource_uri": "/api/1.0/repositories/jaredhanson/super-secret" \
              } \
            ], \
            "user": { \
                "username": "jaredhanson", \
                "first_name": "Jared", \
                "last_name": "Hanson", \
                "avatar": "https://secure.gravatar.com/avatar/6c43616eef331e8ad08c7f90a51069a5?d=identicon&s=32", \
                "resource_uri": "/1.0/users/jaredhanson" \
            } \
        }';
        break;
      case 'https://api.bitbucket.org/1.0/users/jaredhanson/emails':
        body = '[{"active": true, "is_atlassian_id": false, "email": "test@gmail.com", "primary": true}, {"active": true, "is_atlassian_id": false, "email": "hello@sifteo.com", "primary": false}]';
        break;
      default:
        return callback(new Error('wrong url argument'));
      }
      callback(null, body, undefined);
    };
    
    
    var profile;
    
    before(function(done) {
      strategy.userProfile('token', 'token-secret', {}, function(err, p) {
        if (err) { return done(err); }
        profile = p;
        done();
      });
    });
    
    it('should parse profile', function() {
      expect(profile.provider).to.equal('bitbucket');
      expect(profile.id).to.be.undefined;
      expect(profile.username).to.equal('jaredhanson');
      expect(profile.displayName).to.equal('Jared Hanson');
      expect(profile.name.familyName).to.equal('Hanson');
      expect(profile.name.givenName).to.equal('Jared');
      expect(profile.emails).to.have.length(2);
      expect(profile.emails[0].value).to.equal('test@gmail.com');
      expect(profile.emails[0].primary).to.equal(true);
      expect(profile.emails[0].verified).to.equal(undefined);
      expect(profile.emails[1].value).to.equal('hello@sifteo.com');
      expect(profile.emails[1].primary).to.equal(false);
      expect(profile.emails[1].verified).to.equal(undefined);
    });
    
    it('should set raw property', function() {
      expect(profile._raw).to.be.a('string');
    });
    
    it('should set json property', function() {
      expect(profile._json).to.be.an('object');
    });
  }); // fetched from API version 1 endpoint and then fetching emails
  
  describe('fetched from API version 1 endpoint and then failing fetching emails', function() {
    var strategy =  new BitbucketStrategy({
      consumerKey: 'ABC123',
      consumerSecret: 'secret',
      userProfileURL: 'https://api.bitbucket.org/1.0/user/',
      includeEmail: true
    }, function() {});
  
    strategy._oauth.get = function(url, token, tokenSecret, callback) {
      var body;
      switch (url) {
      case 'https://api.bitbucket.org/1.0/user/':
        body = '{ \
            "repositories": [ \
              { \
                  "scm": "git", \
                  "has_wiki": false, \
                  "last_updated": "2012-01-09 06:12:36", \
                  "created_on": "2012-01-09 06:11:25", \
                  "owner": "jaredhanson", \
                  "logo": null, \
                  "email_mailinglist": "", \
                  "is_mq": false, \
                  "size": 2515, \
                  "read_only": false, \
                  "fork_of": null, \
                  "mq_of": null, \
                  "state": "available", \
                  "utc_created_on": "2012-01-09 05:11:25+00:00", \
                  "website": "", \
                  "description": "Secret project.", \
                  "has_issues": false, \
                  "is_fork": false, \
                  "slug": "secret", \
                  "is_private": true, \
                  "name": "secret", \
                  "language": "", \
                  "utc_last_updated": "2012-01-09 05:12:36+00:00", \
                  "email_writers": true, \
                  "main_branch": "master", \
                  "no_public_forks": false, \
                  "resource_uri": "/api/1.0/repositories/jaredhanson/secret" \
              }, \
              { \
                  "scm": "git", \
                  "has_wiki": false, \
                  "last_updated": "2012-01-12 08:46:02", \
                  "created_on": "2011-12-15 01:03:27", \
                  "owner": "jaredhanson", \
                  "logo": null, \
                  "email_mailinglist": "", \
                  "is_mq": false, \
                  "size": 99600, \
                  "read_only": false, \
                  "fork_of": null, \
                  "mq_of": null, \
                  "state": "available", \
                  "utc_created_on": "2011-12-15 00:03:27+00:00", \
                  "website": "", \
                  "description": "Super secret project.", \
                  "has_issues": false, \
                  "is_fork": false, \
                  "slug": "super-secret", \
                  "is_private": true, \
                  "name": "super-secret", \
                  "language": "", \
                  "utc_last_updated": "2012-01-12 07:46:02+00:00", \
                  "email_writers": true, \
                  "main_branch": "master", \
                  "no_public_forks": false, \
                  "resource_uri": "/api/1.0/repositories/jaredhanson/super-secret" \
              } \
            ], \
            "user": { \
                "username": "jaredhanson", \
                "first_name": "Jared", \
                "last_name": "Hanson", \
                "avatar": "https://secure.gravatar.com/avatar/6c43616eef331e8ad08c7f90a51069a5?d=identicon&s=32", \
                "resource_uri": "/1.0/users/jaredhanson" \
            } \
        }';
        break;
      case 'https://api.bitbucket.org/1.0/users/jaredhanson/emails':
        return callback({ statusCode: 404,
                          data: '{"error": {"message": "Resource not found", "detail": "There is no API hosted at this URL.\\n\\nFor information about our API\'s, please refer to the documentation at: https://confluence.atlassian.com/x/IYBGDQ"}}' });
        break;
      default:
        return callback(new Error('wrong url argument'));
      }
      callback(null, body, undefined);
    };
    
    
    var profile;
    
    before(function(done) {
      strategy.userProfile('token', 'token-secret', {}, function(err, p) {
        if (err) { return done(err); }
        profile = p;
        done();
      });
    });
    
    it('should parse profile', function() {
      expect(profile.provider).to.equal('bitbucket');
      expect(profile.id).to.be.undefined;
      expect(profile.username).to.equal('jaredhanson');
      expect(profile.displayName).to.equal('Jared Hanson');
      expect(profile.name.familyName).to.equal('Hanson');
      expect(profile.name.givenName).to.equal('Jared');
      expect(profile.emails).to.be.undefined;
    });
    
    it('should set raw property', function() {
      expect(profile._raw).to.be.a('string');
    });
    
    it('should set json property', function() {
      expect(profile._json).to.be.an('object');
    });
  }); // fetched from API version 1 endpoint and then failing to fetching emails
  
  describe('error caused by invalid token', function() {
    var strategy = new BitbucketStrategy({
      consumerKey: 'ABC123',
      consumerSecret: 'secret'
    }, function verify(){});
    
    strategy._oauth.get = function(url, token, tokenSecret, callback) {
      callback({ statusCode: 401, data: '' });
    }
    
    
    var err, profile;
    
    before(function(done) {
      strategy.userProfile('x-token', 'token-secret', { user_id: '123' }, function(e, p) {
        err = e;
        profile = p;
        done();
      });
    });
  
    it('should error', function() {
      expect(err).to.be.an.instanceOf(Error);
      expect(err.message).to.equal('Failed to fetch user profile');
    });
    
    it('should not supply profile', function() {
      expect(profile).to.be.undefined;
    });
  }); // error caused by invalid token
  
  describe('error caused by malformed response', function() {
    var strategy = new BitbucketStrategy({
      consumerKey: 'ABC123',
      consumerSecret: 'secret'
    }, function verify(){});
    
    strategy._oauth.get = function(url, token, tokenSecret, callback) {
      var body = 'Hello, world.';
      callback(null, body, undefined);
    }
    
    
    var err, profile;
    
    before(function(done) {
      strategy.userProfile('token', 'token-secret', { user_id: '123' }, function(e, p) {
        err = e;
        profile = p;
        done();
      });
    });
  
    it('should error', function() {
      expect(err).to.be.an.instanceOf(Error);
      expect(err.message).to.equal('Failed to parse user profile');
    });
    
    it('should not supply profile', function() {
      expect(profile).to.be.undefined;
    });
  }); // error caused by malformed response
  
  describe('internal error', function() {
    var strategy = new BitbucketStrategy({
      consumerKey: 'ABC123',
      consumerSecret: 'secret'
    }, function verify(){});
    
    strategy._oauth.get = function(url, token, tokenSecret, callback) {
      return callback(new Error('something went wrong'));
    }
    
    
    var err, profile;
    before(function(done) {
      strategy.userProfile('token', 'token-secret', { user_id: '123' }, function(e, p) {
        err = e;
        profile = p;
        done();
      });
    });
  
    it('should error', function() {
      expect(err).to.be.an.instanceOf(Error);
      expect(err.constructor.name).to.equal('InternalOAuthError');
      expect(err.message).to.equal('Failed to fetch user profile');
      expect(err.oauthError).to.be.an.instanceOf(Error);
      expect(err.oauthError.message).to.equal('something went wrong');
    });
  
    it('should not supply profile', function() {
      expect(profile).to.be.undefined;
    });
  }); // internal error
  
});
