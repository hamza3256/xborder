/*jslint node: true */
/*global describe:true*/
/*global it:true*/
/*global xdescribe:true*/
/*global xit:true*/

var assert   = require("assert");
var coinbase = require('..');
var Client   = coinbase.Client;
var Account  = coinbase.model.Account;
var Buy      = coinbase.model.Buy;
var na       = require('./nockTransfer.js');

describe('model.Buy', function(){

  describe('buy constructor', function(){

    it('should return transfer', function(){
      var transfer = new Buy(
        {},
        {'id': '999'},
        {'id': '999'}
        );
      assert(transfer);
    });
    it('should require constructor new call', function(){
      var t1 = Buy(
        {},
        {'id': '999'},
        {'id': '999'}
        );
      assert(t1 instanceof Buy);
    });
    it('should require constructor args', function(){
      try {
        Transfer();
      } catch(err) {
        assert(true);
        return;
      }
      assert(false);
    });

  });

  describe('buy methods', function() {

    var client = new Client({'apiKey': 'LQIxV1ne9l9w9fWj', 'apiSecret': '72dPDid8BZ3ZTYA8hQKeDdvUnBt4K5Wp', 'baseApiUri': na.TEST_BASE_URI});
    var account = new Account(client, na.ACCT);
    var xfer = new Buy(client, na.XFER_1, account);
    it('should commit transfer', function() {
      xfer.commit(function(err, update) {
        assert.equal(err, null, err);
        assert(update, 'no updated xfer');
      });
    });
  });
});

