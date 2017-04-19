var mysql = require('mysql')
var prompt = require('prompt')

var connection = mysql.createConnection({
	host: '127.0.0.1',
	user: 'root',
	database: 'bamazon'
});

prompt.start();
connection.connect();

connection.query('SELECT * FROM products', function(err, rows, fields) {
  if (err) throw err;
  
  console.log(rows)
  buy()
})

function buy() {
  var schema = {
    properties: {
      item: {
        description: 'ID of item you would like?',
        type: 'number',
        pattern: /\d+/,
        message: 'Nonnegative number > 0 plz',
        required: true
      },
      amount: {
        description: 'How many of that item would you like?',
        type: 'number',
        pattern: /\d+/,
        message: 'Nonnegative number > 0 plz',
        default: 1
      }
    }
  }
  prompt.get(schema, function(err, results) {
    console.log('Item: ' + results.item + '\r\nAmount: ' + results.amount)
    
    connection.query(`SELECT * FROM products WHERE item_id = ${results.item}`, function(err, rows, fields) {
      if (err) throw err;
      
      if (results.amount > rows[0].stock_quantity) {console.log('Invalid amount')}
      else {console.log(`Your cost is ${results.amount * rows[0].price}`)};
      
    });
    
    connection.end()
  });
}