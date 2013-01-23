var vows = require('vows');
var assert = require('assert');
var util = require('util');
var BitbucketStrategy = require('passport-bitbucket/strategy');


vows.describe('BitbucketStrategy').addBatch({
  
  'strategy': {
    topic: function() {
      return new BitbucketStrategy({
        consumerKey: 'ABC123',
        consumerSecret: 'secret'
      },
      function() {});
    },
    
    'should be named bitbucket': function (strategy) {
      assert.equal(strategy.name, 'bitbucket');
    },
  },
  
  'strategy when loading user profile': {
    topic: function() {
      var strategy = new BitbucketStrategy({
        consumerKey: 'ABC123',
        consumerSecret: 'secret'
      },
      function() {});
      
      // mock
      strategy._oauth.get = function(url, token, tokenSecret, callback) {
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
      
      return strategy;
    },
    
    'when told to load user profile': {
      topic: function(strategy) {
        var self = this;
        function done(err, profile) {
          self.callback(err, profile);
        }
        
        process.nextTick(function () {
          strategy.userProfile('token', 'token-secret', {}, done);
        });
      },
      
      'should not error' : function(err, req) {
        assert.isNull(err);
      },
      'should load profile' : function(err, profile) {
        assert.equal(profile.provider, 'bitbucket');
        assert.equal(profile.username, 'jaredhanson');
        assert.equal(profile.displayName, 'Jared Hanson');
        assert.equal(profile.name.familyName, 'Hanson');
        assert.equal(profile.name.givenName, 'Jared');
      },
      'should set raw property' : function(err, profile) {
        assert.isString(profile._raw);
      },
      'should set json property' : function(err, profile) {
        assert.isObject(profile._json);
      },
    },
  },
  
  'strategy when loading user profile and encountering an error': {
    topic: function() {
      var strategy = new BitbucketStrategy({
        consumerKey: 'ABC123',
        consumerSecret: 'secret'
      },
      function() {});
      
      // mock
      strategy._oauth.get = function(url, token, tokenSecret, callback) {
        callback(new Error('something went wrong'));
      }
      
      return strategy;
    },
    
    'when told to load user profile': {
      topic: function(strategy) {
        var self = this;
        function done(err, profile) {
          self.callback(err, profile);
        }
        
        process.nextTick(function () {
          strategy.userProfile('token', 'token-secret', {}, done);
        });
      },
      
      'should error' : function(err, req) {
        assert.isNotNull(err);
      },
      'should wrap error in InternalOAuthError' : function(err, req) {
        assert.equal(err.constructor.name, 'InternalOAuthError');
      },
      'should not load profile' : function(err, profile) {
        assert.isUndefined(profile);
      },
    },
  },

}).export(module);
