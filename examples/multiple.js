'use strict';

var Separator = require('choices-separator');
var Prompt = require('..');
var answers = {};

var theme = new Prompt({
  name: 'theme',
  message: 'What do you want to do?',
  choices: [
    'Order a pizza',
    'Make a reservation',
    new Separator(' ───────'),
    'Ask for opening hours',
    {
      name: 'Contact support',
      disabled: 'Unavailable at this time'
    },
    'Talk to the receptionist'
  ]
});

var size = new Prompt({
  name: 'size',
  message: 'What size do you need?',
  choices: ['Jumbo', 'Large', 'Standard', 'Medium', 'Small', 'Micro'],
  filter: function (val) {
    return val.toLowerCase();
  }
});

theme.run()
  .then(function(answer) {
    answers.theme = answer;

    size.run()
      .then(function(answer) {
        answers.size = answer;
        console.log(JSON.stringify(answers, null, 2));
      });
  });
