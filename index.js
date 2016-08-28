'use strict';

var util = require('util');
var Paginator = require('terminal-paginator');
var BasePrompt = require('enquirer-prompt');
var isNumber = require('is-number');
var cursor = require('cli-cursor');
var log = require('log-utils');

/**
 * `list` type prompt
 */

function Prompt() {
  BasePrompt.apply(this, arguments);

  if (!this.question.choices) {
    throw new TypeError('expected choices to be an array');
  }

  this.firstRender = true;
  this.selected = this.question.choices.getIndex(this.question.default);

  // Make sure no default is set (so it won't be printed)
  this.question.default = null;
  this.paginator = new Paginator();
}

/**
 * Inherit `BasePrompt`
 */

util.inherits(Prompt, BasePrompt);

/**
 * Start the prompt session
 * @param  {Function} `cb` Callback when prompt is finished
 * @return {Object} Returns the `Prompt` instance
 */

Prompt.prototype.ask = function(cb) {
  this.callback = cb;
  var self = this;

  this.ui.once('line', function(e) {
    self.onSubmit({value: self.getChoice(e)});
  });

  this.ui.on('up', this.onUpKey.bind(this));
  this.ui.on('down', this.onDownKey.bind(this));
  this.ui.on('number', this.onNumberKey.bind(this));

  // Init the prompt
  cursor.hide();
  this.render();
  return this;
};

/**
 * Render the prompt to the terminal
 */

Prompt.prototype.render = function() {
  // Render question
  var message = this.message;
  if (this.firstRender) {
    message += log.dim('(Use arrow keys)');
  }
  // Render choices or answer depending on the state
  if (this.status === 'answered') {
    message += log.cyan(this.question.choices.getChoice(this.selected).short);
  } else {
    var choicesStr = listRender(this.question.choices, this.selected);
    var indexPosition = this.question.choices.indexOf(this.question.choices.getChoice(this.selected));
    message += '\n' + this.paginator.paginate(choicesStr, indexPosition, this.question.pageSize);
  }
  this.firstRender = false;
  this.ui.render(message);
};

/**
 * When the user presses the `up` key
 */

Prompt.prototype.onUpKey = function() {
  var len = this.question.choices.realLength;
  this.selected = (this.selected > 0) ? this.selected - 1 : len - 1;
  this.render();
};

/**
 * When the user presses the `down` key
 */

Prompt.prototype.onDownKey = function() {
  var len = this.question.choices.realLength;
  this.selected = (this.selected < len - 1) ? this.selected + 1 : 0;
  this.render();
};

/**
 * When the user presses a number key
 */

Prompt.prototype.onNumberKey = function(input) {
  if (input <= this.question.choices.realLength) {
    this.selected = input - 1;
  }
  this.render();
};

/**
 * When they user presses they `enter` key
 */

Prompt.prototype.onSubmit = function(value) {
  this.status = 'answered';
  this.render();
  this.ui.write();
  cursor.show();
  this.callback(value);
};

/**
 * Get the currently defined value
 */

Prompt.prototype.getChoice = function() {
  return this.question.choices.getChoice(this.selected).value;
};

/**
 * Function for rendering list choices
 * @param  {Number} pointer Position of the pointer
 * @return {String} Rendered content
 */

function listRender(choices, pointer) {
  var separatorOffset = 0;
  var output = '';

  choices.forEach(function(choice, i) {
    if (choice.type === 'separator') {
      separatorOffset++;
      output += '  ' + choice + '\n';
      return;
    }

    if (choice.disabled) {
      separatorOffset++;
      output += '  - ' + choice.name;
      output += ' (' + (typeof choice.disabled === 'string' ? choice.disabled : 'Disabled') + ')';
      output += '\n';
      return;
    }

    var isSelected = (i - separatorOffset === pointer);
    var line = (isSelected ? '❯ ' : '  ') + choice.name;
    if (isSelected) {
      line = log.cyan(line);
    }
    output += line + ' \n';
  });

  return output.replace(/\n$/, '');
}

/**
 * Module exports
 */

module.exports = Prompt;
