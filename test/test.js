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

  it('should throw an error when invalid args are passed', function() {
    assert.throws(function() {
      Prompt();
    });

    assert.throws(function() {
      Prompt(new Prompt({name: 'foo'}));
    });

    assert.throws(function() {
      new Prompt();
    });
  });

  it('should return answer as a string from .run', function(cb) {
    var prompt = new Prompt({
      name: 'color',
      message: 'What colors do you like?',
      choices: ['red', 'green', 'blue']
    });

    var unmute = prompt.mute();

    prompt.on('ask', function() {
      prompt.rl.input.emit('keypress', '1');
      prompt.rl.input.emit('keypress', '\n');
    });

    prompt.run()
      .then(function(answer) {
        assert.deepEqual(answer, 'red');
        unmute();
        cb();
      })
  });

  it('should return answer as a string from .ask', function(cb) {
    var prompt = new Prompt({
      name: 'color',
      message: 'What colors do you like?',
      choices: ['red', 'green', 'blue']
    });

    var unmute = prompt.mute();

    prompt.on('ask', function() {
      prompt.rl.input.emit('keypress', '1');
      prompt.rl.input.emit('keypress', '\n');
    });

    prompt.ask(function(answer) {
      assert.deepEqual(answer, 'red');
      unmute();
      cb();
    });
  });
});
