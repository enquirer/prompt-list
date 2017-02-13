'use strict';

var Enquirer = require('enquirer');
var enquirer = new Enquirer();

enquirer.register('list', require('..'));

var questions = [
  {
    type: 'list',
    name: 'action',
    message: 'What do you want to do?',
    choices: [
      'Order a pizza',
      'Make a reservation',
      enquirer.separator(),
      'Ask for opening hours',
      {
        name: 'Contact support',
        disabled: 'Unavailable at this time'
      },
      'Talk to the receptionist'
    ]
  },
  {
    type: 'list',
    name: 'pizza',
    message: 'What size do you need?',
    choices: ['Jumbo', 'Large', 'Standard', 'Medium', 'Small', 'Micro'],
    when: function(answers) {
      return answers.action === 'Order a pizza';
    },
    filter: function(val) {
      return val.toLowerCase();
    }
  },
  {
    type: 'list',
    name: 'reservation',
    message: 'What month?',
    choices: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    when: function(answers) {
      return answers.action === 'Make a reservation';
    },
    filter: function(val) {
      return val.toLowerCase();
    },
  }
];

enquirer.ask(questions)
  .then(function(answers) {
    console.log(answers);
  })
  .catch(function(err) {
    console.log(err);
  });
