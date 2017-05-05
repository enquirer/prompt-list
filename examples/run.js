var answers = {foo: 'baz'};
var List = require('..');
var list = new List({
  name: 'order',
  message: 'What would you like to order?',
  choices: [
    'Coke',
    'Diet Coke',
    'Cherry Coke',
    {
      name: 'Sprite',
      disabled: 'Temporarily unavailable'
    },
    'Water'
  ],
  when: function(answers) {
    return answers.foo === 'baz';
  }
});

list.run(answers)
  .then(function(answer) {
    console.log(answer);
  });
