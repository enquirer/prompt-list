'use strict';

var dim = require('ansi-dim');
var List = require('..');

/**
 * Example prompt from Inquirer
 */

var prompt = new List({
  type: 'list',
  name: 'theme',
  message: 'What do you want to do?',
  choices: [
    'Order a pizza',
    'Make a reservation',
    new List.Separator(dim(' ─────────────')),
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
  name: 'size',
  message: 'What size do you need?',
  choices: ['Jumbo', 'Large', 'Standard', 'Medium', 'Small', 'Micro'],
  filter: function(val) {
    return val.toLowerCase();
  }
});

prompt.run()
  .then(function(answer) {
    console.log(JSON.stringify(answer, null, '  '));
  });
