'use strict';

var debug = require('debug')('prompt-list');
var Prompt = require('prompt-checkbox');
var cyan = require('ansi-cyan');
var dim = require('ansi-dim');
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

  this.firstRender = true;
  this.choices.options.checkbox = {on: '', off: '', disabled: ''};
  this.choices.options.pointer = cyan('❯');
  this.choices.options.format = function(str) {
    return (!this.disabled && this.position === this.index) ? cyan(str) : str;
  };
}

/**
 * Inherit Prompt
 */

Prompt.extend(List);

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
  if (this.firstRender) {
    this.firstRender = false;
    message += dim('(Use arrow keys)');
  }

  if (this.status === 'answered') {
    message += cyan(this.answer);
  } else {
    message += this.choices.render(this.position, {paginate: true});
  }

  this.ui.render(message, append);
};

/**
 * Get the currently selected value
 */

List.prototype.getSelected = function() {
  var choice = this.choices.getChoice(this.position);
  if (choice) {
    return choice.disabled ? false : choice.value;
  }
};

/**
 * Module exports
 */

module.exports = List;
