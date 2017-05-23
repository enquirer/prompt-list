'use strict';

var debug = require('debug')('prompt-list');
var Radio = require('prompt-radio');
var cyan = require('ansi-cyan');

/**
 * List prompt
 */

function List(question, answers, ui) {
  debug('initializing from <%s>', __filename);
  Radio.apply(this, arguments);

  this.choices.options.checkbox = false;
  this.choices.options.format = function(str) {
    return this.position === this.index ? cyan(str) : str;
  };
}

/**
 * Inherit Radio
 */

Radio.extend(List);

/**
 * Render final selected answer when "line" ("enter" keypress)
 * is emitted
 */

List.prototype.renderAnswer = function() {
  return cyan(this.getAnswer());
};

/**
 * Get selected list item
 */

List.prototype.getAnswer = function() {
  return this.choices.key(this.position);
};

/**
 * Module exports
 */

module.exports = List;
