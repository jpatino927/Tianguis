const mysql = require("mysql");
const inquirer = require("inquirer");
const connection = mysql.createConnection({
    host:'localhost',
    port: 3306,
    user: "root",
    password:"C0d3b00tc4mp2016#@",
    database: "tianguisdb"
})
connection.connect(function(err){
    if (err){
        console.log("error occured");
    }
    console.log("it works");
    connection.query('SELECT * FROM chucherias', function(err,res){
        if(err) throw err
        console.log("ID", "Product Name", "Department", "Price", "Stock Quantity")
        console.log("======================================================")
        for(let row in res){
            console.log(res[row].item_id, res[row].product_name, res[row].department_name, res[row].price, res[row].stock_quantity)
        }
        console.log("======================================================")
        //https://www.npmjs.com/package/inquirer#methods
        inquirer.prompt([{
            type:'input',
            name:'choice',
            message:'what is the id item you would like to purchase?',

        }]).then(function(value){
            let id = parseInt(value.choice)
            console.log(id);
            console.log(value);
            let found = false;
            let item = null;
            for(let row in res){
                if(id === res[row].item_id){
                    console.log(res[row])
                    item = res[row]
                    found = true;

                }                
            }
            if(!found){
                console.log('item id not found');    
            }else{
                inquirer.prompt([
                    {
                        type:'input',
                        name:'quantity',
                        message:'how many of this item would you like to purchase?'
                    }
                ]).then(function(value){
                    let quantity = parseInt(value.quantity);
                    if(quantity> item.stock_quantity){
                        console.log("We are out off stock for this item")
                    }else{
                        connection.query('UPDATE chucherias SET stock_quantity = stock_quantity - ? WHERE item_id = ?',[quantity,id],function(err,res){
                            console.log(quantity , item.product_name, 'Purchased today. NO RETURNS:s Item is yours. Have a nice day');
                            return
                        })
                    }
                })
            }
            
        })
    })
})
