var chai = require('chai')
  , BitbucketStrategy = require('../lib/strategy');


describe('Strategy', function() {
  
  describe('constructed', function() {
    var strategy = new BitbucketStrategy({
      consumerKey: 'ABC123',
      consumerSecret: 'secret'
    }, function(){});
    
    it('should be named bitbucket', function() {
      expect(strategy.name).to.equal('bitbucket');
    });
  })
  
  describe('constructed with undefined options', function() {
    it('should throw', function() {
      expect(function() {
        var strategy = new FitBitStrategy(undefined, function(){});
      }).to.throw(Error);
    });
  })
  
});
