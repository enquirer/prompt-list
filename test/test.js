'use strict';

require('mocha');
var assert = require('assert');
var Prompt = require('..');
var Enquirer = require('enquirer');

describe('prompt-list', function() {
  it('should export a function', function() {
    assert.equal(typeof Prompt, 'function');
  });

  it('should intantiate', function() {
    var prompt = new Prompt({name: 'foo', choices: ['foo', 'bar']});
    assert(prompt instanceof Prompt);
  });

  it('should set options.type to `list`', function() {
    var prompt = new Prompt({name: 'foo', choices: ['foo', 'bar']});
    assert.equal(prompt.options.type, 'list');
    assert.equal(prompt.question.type, 'list');
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


  it('should not set a value if there is not a default value and the question was not asked', function () {
    var unmute;
    var enquirer = new Enquirer().register('list', Prompt);
    var questions = [{
      type: 'list',
      name: 'color',
      message: 'What colors do you like?',
      choices: ['red', 'green', 'blue'],
      when: function () {
        return false
      }
    }, {
      type: 'list',
      name: 'pet',
      default: 1,
      message: 'What animal do you want as a pet?',
      choices: ['cat', 'dog', 'hamster'],
      when: function () {
        return false
      }
    }, {
      type: 'list',
      name: 'month',
      message: 'What month?',
      choices: ['January', 'February', 'March'],
      when: function () {
        return true
      }
    }]

    return enquirer
      .once('prompt', function(prompt) {
        unmute = prompt.mute();
      })
      .on('ask', function() {
        enquirer.rl.input.emit('keypress', '1');
        enquirer.rl.input.emit('keypress', '\n');
      })
      .ask(questions)
      .then(answers => {
        assert.deepEqual(answers.color, undefined);
        assert.deepEqual(answers.pet, 'dog');
        assert.deepEqual(answers.month, 'January');
      })
  })
});
