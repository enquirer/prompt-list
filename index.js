'use strict';

var debug = require('debug')('prompt-list');
var Paginator = require('terminal-paginator');
var utils = require('readline-utils');
var Prompt = require('prompt-base');
var cyan = require('ansi-cyan');
var red = require('ansi-red');

/**
 * List prompt
 */

function List(question, answers, ui) {
  if (!(this instanceof List)) {
    return new List(question, answers, ui);
  }

  debug('initializing from <%s>', __filename);
  Prompt.apply(this, arguments);
  if (!this.choices) {
    throw new Error('expected "options.choices" to be an object or array');
  }

  this.setDefault();
  this.question.default = null;

  this.position = 0;
  this.paginator = new Paginator(this.options.pageSize);

  this.choices.options.symbol = '';
  this.choices.options.format = function(str) {
    return (!this.disabled && this.position === this.index)
      ? cyan(str)
      : str;
  };
}

/**
 * Inherit Prompt
 */

Prompt.extend(List);

/**
 * Start the prompt session
 * @param  {Function} `cb` Callback when prompt is finished
 * @return {Object} Returns the `List` instance
 */

List.prototype.ask = function(cb) {
  this.callback = cb;
  var self = this;

  this.ui.once('error', this.onError.bind(this));
  this.only('line', this.onSubmit.bind(this));
  this.only('keypress', function(event) {
    self.move(event.key.name, event);
  });

  // Init the prompt
  utils.cursorHide(this.rl);
  this.render();
  return this;
};

/**
 * Render the current prompt message.
 *
 * @api public
 */

List.prototype.render = function(state) {
  var append = typeof state === 'string'
    ? red('>> ') + state
    : '';

  var message = this.message;
  if (this.status === 'answered') {
    message += cyan(this.answer);
  } else {
    var str = this.choices.render(this.position);
    message += '\n' + this.paginator.paginate(str, this.position);
  }

  this.ui.render(message, append);
};

/**
 * When user press `enter` key
 */

List.prototype.onSubmit = function() {
  this.answer = this.getAnswer();
  if (!this.validate(this.answer)) {
    return;
  }

  this.status = 'answered';
  var self = this;

  this.once('answer', function() {
    utils.cursorHide(self.rl);
  });

  this.submitAnswer();
};

/**
 * Set the default value to use
 */

List.prototype.setDefault = function() {
  if (this.question.hasDefault) {
    this.choices.enable(this.question.default);
  }
};

/**
 * Get the currently selected value
 */

List.prototype.getAnswer = function() {
  var choice = this.choices.getChoice(this.position);
  if (choice) {
    return choice.disabled ? false : choice.value;
  }
};

/**
 * Module exports
 */

module.exports = List;
