var mysql = require('mysql');
var prompt = require('prompt');

var connection = mysql.createConnection({
	host: '127.0.0.1',
	user: 'root',
	database: 'bamazon'
});

prompt.start();
connection.connect();

console.log('\r\nWhat are you interested in?\r\n')
console.log('View Products for [S]ale')
console.log('View [L]ow Inventory')
console.log('View [H]igh Inventory')
console.log('[A]dd to Inventory')
console.log('Add [N]ew Product')

var schema = {
  properties: {
    query: {
      description:' ',
      pattern: /^[shlan]$/i,
      message: 'Incorrect entry. Please try again.',
      required: true,
      before: function(value) {return value.toUpperCase();}
    }
  } 
}

prompt.get(schema,function(err, results) {
  if (err) throw err;
  
  switch(results.query) {
    case 'A':
      forSale(true)
      return setTimeout(addInventory,1000);
    case 'S':
      return forSale();
    case 'H':
      return highInventory();
    case 'L':
      return lowInventory();
    case 'N':
      return addItem();
    default:
      throw 'Error in switch. Check code.'
  }
  
})

function forSale(bool) {
  //Passed arg if ran in another function to prevent ending connection. Empty by default
  
  connection.query(`SELECT * FROM products ${bool ? '' : 'WHERE stock_quantity > 0'} ;`, function(err, rows, fields) {
    
    console.log('ID | Department | Product | Price | Stock')
    
    for(let i = 0; i < rows.length; i++) {
      let row = rows[i]
      console.log(`${row.item_id} | ${row.department_name} | ${row.product_name} | $${row.price} | ${row.stock_quantity}`);  
    }
    
    if(!bool) endQuery(); 
  })
}

function lowInventory() {
  
  connection.query('SELECT * FROM products WHERE stock_quantity < 5;', function(err, rows, fields) {
    
    console.log('Department | Product | Price | Stock')
    
    for(let i = 0; i < rows.length; i++) {
      let row = rows[i]
      console.log(`${row.department_name} | ${row.product_name} | $${row.price} | ${row.stock_quantity}`);  
    }
    endQuery();
  })
}

function highInventory() {
  
  connection.query('SELECT * FROM products WHERE stock_quantity > 90;', function(err, rows, fields) {
    
    console.log('Department | Product | Price | Stock')
    
    for(let i = 0; i < rows.length; i++) {
      let row = rows[i]
      console.log(`${row.department_name} | ${row.product_name} | $${row.price} | ${row.stock_quantity}`);  
    }
    endQuery();
  })
}

function addInventory() {
    
  let schema = {
    properties: {
      id: {
        pattern: /^(\d+|cancel)$/,
        message: 'Not a number',
        required: true
      },
      quantity: {
        pattern: /^(\d+|cancel)$/,
        message: 'Not a number',
        required: true
      }
    }
  }
  
  prompt.get(schema, function(err, results) {
    
    if(results.id == 'cancel' || results.quantity == 'cancel') {return endQuery();}
    
    connection.query(`UPDATE products SET stock_quantity = stock_quantity + ${results.quantity} \
                      WHERE item_id = ${results.id};`, function(err, results, fields) {
      
      console.log(results.message);
      endQuery();
      
    });
    
  });
  
};

function addItem() {
  
  let schema = {
    properties: {
      itemName: {
        pattern: /^[A-Za-z0-9\s]+$/,
        message: 'Incorrect formatting. No special characters.',
        required: true
      },
      itemCost: {
        pattern: /^(\d*[.])?\d+$/g,
        message: 'Incorrect formatting. No special characters or letters.',
        required: true,
      },
      department: {
        pattern: /^[A-Za-z][A-Za-z\s]+$/,
        message: 'Incorrect formatting. No numbers or special characters.',
        required: true
      },
      stock: {
        pattern: /^\d+$/,
        message: 'Number plz.',
        required: true
      }
    }
  }
  
  prompt.get(schema, function(err, Results) {
    
    let itemCost = parseInt(Results.itemCost).toFixed(2);
    connection.query(`INSERT INTO products VALUES (null,'${Results.itemName}','${Results.department}',${itemCost},${Results.stock});`, function(err, results) {
      
      if (err) throw err;
      console.log(results)
      endQuery();
    })
  })
}

function endQuery() {connection.end();}