'use strict';

var debug = require('debug')('prompt-list');
var Radio = require('prompt-radio');
var cyan = require('ansi-cyan');
var dim = require('ansi-dim');

/**
 * List prompt
 */

function List(question, answers, ui) {
  debug('initializing from <%s>', __filename);
  Radio.apply(this, arguments);
  var initialized = false;

  this.question.type = 'list';
  this.on('ask', () => {
    if (initialized) return;
    initialized = true;
    this.helpMessage = this.options.helpMessage || dim('(Use arrow keys)');
    this.choices.options.checkbox = false;
    this.choices.options.format = function(line) {
      return this.position === this.index ? cyan(line) : line;
    };
  });

  this.on('render', () => {
    if (this.contextHistory.length > 0) this.helpMessage = '';
  });
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
