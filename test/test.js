'use strict';

require('mocha');
var assert = require('assert');
var Prompt = require('..');

describe('prompt-list', function() {
  it('should export a function', function() {
    assert.equal(typeof Prompt, 'function');
  });

  it('should intantiate', function() {
    var prompt = new Prompt({name: 'foo', choices: ['foo', 'bar']});
    assert(prompt instanceof Prompt);
  });

  it('should intantiate without new', function() {
    var prompt = Prompt({name: 'foo', choices: ['foo', 'bar']});
    assert(prompt instanceof Prompt);
  });

  it('should throw an error when invalid args are passed', function(cb) {
    try {
      Prompt();
      cb(new Error('expected an error'));
    } catch (err) {
      assert(err);
      assert.equal(err.message, 'expected question to be a string or object');
      cb();
    }
  });

  it('should throw an error when `choices` are not passed on the `options`', function(cb) {
    try {
      Prompt({name: 'foo'});
      cb(new Error('expected an error'));
    } catch (err) {
      assert(err);
      assert.equal(err.message, 'expected "options.choices" to be an object or array');
      cb();
    }
  });
});
