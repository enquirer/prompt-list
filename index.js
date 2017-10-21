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
  this.listInitialized = false;
  this.question.type = 'list';
  this.on('ask', this.onAsk.bind(this));
  this.on('render', () => {
    if (this.contextHistory.length > 0) this.helpMessage = '';
  });
}

/**
 * Inherit Radio
 */

Radio.extend(List);

/**
 * Render a choice.
 */

List.prototype.onAsk = function() {
  if (this.listInitialized) return;
  this.listInitialized = true;
  this.helpMessage = this.options.helpMessage || dim('(Use arrow keys)');
  this.choices.options.checkbox = false;
  this.choices.options.format = this.renderChoice(this.choices);
};

/**
 * Render a choice.
 */

List.prototype.renderChoice = function(choices) {
  return function(line) {
    return choices.position === choices.index ? cyan(line) : line;
  };
};

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
