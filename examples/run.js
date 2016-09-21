var List = require('..');
var list = new List({
  type: 'list',
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
  ]
});

list.run()
  .then(function(answer) {
    console.log(answer);
  });
