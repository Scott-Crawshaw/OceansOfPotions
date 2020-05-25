/*
 * API code (server side) for clients of Oceans of Potions to view their profiles, follow other users, place orders, etc.
 * Scott Crawshaw, Dae Lim Chung, Joanna Liu, Mien (Josephine) Nguyen
 * May 2020
 */

// Set up for bcrypt
const bcrypt = require('bcrypt');
const saltRounds = 10;

var express=require('express');
let mysql = require('mysql');
const bodyParser = require('body-parser'); //allows us to get passed in api calls easily
var app=express();

// get config
var env = process.argv[2] || 'sunapee'; //use sunapee if enviroment not specified
var config = require('./config')[env]; //read credentials from config.js


//Database connection
app.use(function(req, res, next){
	global.connection = mysql.createConnection({
		host     : config.database.host,
		user     : config.database.user,
		password : config.database.password,
		database : config.database.schema
	});
	connection.connect();
	next();
});

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

// set up router
var router = express.Router();

// log request types to server console
router.use(function (req,res,next) {
	console.log("/" + req.method);
	next();
});

// set up routing
// Bare bones request, for testing connection
router.get("/",function(req,res){
	res.send("Welcome to Oceans of Potions API for customers!");
});

// Create account for new customer
// Body must include password, user, fname, lname, minitial, dob, email, phone
router.post("/customers",function(req,res){
	bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
		if (err){
			res.send(JSON.stringify({"status": 500, "error": "Internal error", "response": null}));
			return;
		}
		global.connection.query('INSERT INTO customers (`CustomerUsername`, `CustomerPassword`, `CustomerFirstName`, `CustomerLastName`, `CustomerMiddleInitial`, `CustomerDOB`, `CustomerPrimaryEmail`, `CustomerPrimaryPhone`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
			[req.body.user, hash, req.body.fname, req.body.lname, req.body.minitial, req.body.dob, req.body.email, req.body.phone], function (error, results, fields) {
				sendFinalResult(res, error, results);
			});
	});
});

// Delete account for existing customer
// Can only delete your own account
router.delete("/customers",function(req,res){
	authAndRun(req, res, function(req, res, customerID){
		global.connection.query('DELETE FROM customers WHERE CustomerID = ?', [customerID], function (error, results, fields) {
			sendFinalResult(res, error, results);
		});
	});
});

// View account details for any existing customer
router.get("/customers/:id",function(req,res){
	authAndRun(req, res, function(req, res, customerID){
		global.connection.query('SELECT CustomerID, CustomerFirstName, CustomerLastName, CustomerMiddleInitial, CustomerUsername, CustomerDOB, CustomerPrimaryEmail, CustomerPrimaryPhone FROM customers WHERE CustomerID = ?', [req.params.id], function (error, results, fields) {
			sendFinalResult(res, error, results);
		});
	});
});

// Update account details, not including password
// Include newValue and attribute in body
router.put("/customers",function(req,res){
	authAndRun(req, res, function(req, res, customerID){
		// insertData object lets us parameterize both the attribute and the value
		insertData = new Object();
		insertData[req.body.attribute] = req.body.newValue;
		global.connection.query('UPDATE customers SET ? WHERE CustomerID = ?', [insertData, customerID], function (error, results, fields) {
			sendFinalResult(res, error, results);
		});
	});
});

// Update password
// Include newPassword in body
router.put("/customers/password",function(req,res){
	authAndRun(req, res, function(req, res, customerID){
		bcrypt.hash(req.body.newPassword, saltRounds, function(err, hash) {
			if (err){
				res.send(JSON.stringify({"status": 500, "error": "Internal error", "response": null}));
				return;
			}
			global.connection.query('UPDATE customers SET CustomerPassword = ? WHERE CustomerID = ?', [hash, customerID], function (error, results, fields) {
				sendFinalResult(res, error, results);
			});
		});
	});
});

// View all other customers/browse users
router.get("/customers",function(req,res){
	authAndRun(req, res, function(req, res, customerID){
		global.connection.query('SELECT CustomerID, CustomerFirstName, CustomerLastName, CustomerMiddleInitial, CustomerUsername FROM customers WHERE CustomerID != ?', [customerID], function (error, results, fields) {
			sendFinalResult(res, error, results);
		});
	});
});

// Follow another customer
// No body needed
router.post("/customers/follow/:user",function(req,res){
	authAndRun(req, res, function(req, res, customerID){
		followerID = customerID;
		followingID = req.params.user;
		if (followingID != followerID) { // If not attempting to follow self
			global.connection.query('INSERT INTO following (`FollowerID`, `FollowingID`) VALUES(?, ?)', [followerID, followingID], function (error, results, fields) {
				sendFinalResult(res, error, results);
			});
		}
		else {
			res.send(JSON.stringify({"status": 403, "error": "You cannot follow yourself", "response": null}));
		}
	});
});

// Unfollow another customer
router.delete("/customers/follow/:user",function(req,res){
	authAndRun(req, res, function(req, res, customerID){
		followerID = customerID;
		followingID = req.params.user;
		if (followingID != followerID) { // If not attempting to unfollow self
			global.connection.query('DELETE FROM following WHERE FollowerID = ? AND FollowingID = ?', [followerID, followingID], function (error, results, fields) {
				sendFinalResult(res, error, results);
			});
		}
		else {
			res.send(JSON.stringify({"status": 403, "error": "You cannot unfollow yourself", "response": null}));
		}
	});
});

// View a customer's following list
router.get("/following",function(req,res){
	authAndRun(req, res, function(req, res, customerID){
		global.connection.query('SELECT CustomerID, CustomerFirstName, CustomerLastName, CustomerMiddleInitial, CustomerUsername FROM customers WHERE CustomerID IN (SELECT FollowingID FROM following WHERE FollowerID = ?)', [customerID], function (error, results, fields) {
			sendFinalResult(res, error, results);
		});
	});
});

// View a customer's follower list
router.get("/followers",function(req,res){
	authAndRun(req, res, function(req, res, customerID){
		global.connection.query('SELECT CustomerID, CustomerFirstName, CustomerLastName, CustomerMiddleInitial, CustomerUsername FROM customers WHERE CustomerID IN (SELECT FollowerID FROM following WHERE FollowingID = ?)', [customerID], function (error, results, fields) {
			sendFinalResult(res, error, results);
		});
	});
});

// Gets all potions
router.get("/potions",function(req,res){
	authAndRun(req, res, function(req, res, customerID){
		global.connection.query('SELECT * FROM potions', function (error, results, fields) {
			sendFinalResult(res, error, results);
		});
	});
});

// Gets one potion
router.get("/potions/:id",function(req,res){
	authAndRun(req, res, function(req, res, customerID){
		global.connection.query('SELECT * FROM potions WHERE PotionID = ?', [req.params.id],function (error, results, fields) {
			sendFinalResult(res, error, results);
		});
	});
});

// Add product to order
// Creates a new order if none exists
// Include productID in body
router.post("/orders",function(req,res){
	authAndRun(req, res, function(req, res, customerID){
		global.connection.query('SELECT OrderID FROM orders WHERE OrderCustomerID = ? AND OrderFinal = 0', [customerID],function (error, results, fields) {
			if (error){
				res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
				return;
			}
			if(results.length > 0){
				global.connection.query('INSERT INTO orderproducts (OrderID, ProductID) VALUES (?, ?)', [results[0]['OrderID'], req.body.productID],function (error, results, fields) {
					sendFinalResult(res, error, results);
				});
			}
			else{
				global.connection.query('INSERT INTO orders (OrderCustomerID) VALUES (?)', [customerID], function (error, results, fields) {
					if (error){
						res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
						return;
					}
					global.connection.query('SELECT OrderID FROM orders WHERE OrderCustomerID = ? AND OrderFinal = 0', [customerID], function (error, results, fields) {
						if (error || results.length == 0){
							res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
							return;
						}
						global.connection.query('INSERT INTO orderproducts (OrderID, ProductID) VALUES (?, ?)', [results[0]['OrderID'], req.body.productID], function (error, results, fields) {
							sendFinalResult(res, error, results);
						});
					});
				});
			}
		});
	});
});

// Finalize the current active order
// Include shippingAddress and privacy (true if private, false if public) in body
router.put("/orders",function(req,res){
	authAndRun(req, res, function(req, res, customerID){
		global.connection.query('SELECT OrderID FROM orders WHERE OrderCustomerID = ? AND OrderFinal = 0', [customerID],function (error, results, fields) {
			if (error){
				res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
				return;
			}
			if(results.length > 0){
				global.connection.query('UPDATE orders SET OrderShippingAddress = ?, OrderDate = NOW(), OrderPrivacy = ?, OrderFinal = 1, OrderPrice = (SELECT sum(allproducts.PotionPrice) FROM (SELECT potions.PotionPrice FROM orderproducts JOIN potions ON potions.PotionID = orderproducts.ProductID WHERE orderproducts.OrderID = ?) AS allproducts) WHERE OrderID = ?', [req.body.shippingAddress, req.body.privacy, results[0]['OrderID'], results[0]['OrderID']], function (error, results, fields) {
					sendFinalResult(res, error, results);
				});
			}
			else{
				res.send(JSON.stringify({"status": 404, "error": "No active order found", "response": null}));
				return;
			}
		});
	});
});

// Get products for current active order
router.get("/orders/products",function(req,res){
	authAndRun(req, res, function(req, res, customerID){
		global.connection.query('SELECT OrderID FROM orders WHERE OrderCustomerID = ? AND OrderFinal = 0', [customerID],function (error, results, fields) {
			if (error){
				res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
				return;
			}
			if(results.length > 0){
				global.connection.query('SELECT potions.PotionID, potions.PotionName, potions.PotionDescription, potions.PotionPrice FROM orderproducts JOIN potions ON potions.PotionID = orderproducts.ProductID WHERE orderproducts.OrderID = ?', [results[0]['OrderID']], function (error, results, fields) {
					sendFinalResult(res, error, results);
				});
			}
			else{
				res.send(JSON.stringify({"status": 404, "error": "No active order found", "response": null}));
				return;
			}
		});
	});
});

// Get products for a finalized order given the OrderID
router.get("/orders/products/:id",function(req,res){
	authAndRun(req, res, function(req, res, customerID){
		global.connection.query('SELECT potions.PotionID, potions.PotionName, potions.PotionDescription, potions.PotionPrice FROM orderproducts JOIN potions ON potions.PotionID = orderproducts.ProductID WHERE orderproducts.OrderID = ? AND (select count(*) from orders where OrderID = ? AND (OrderPrivacy = 0 OR OrderCustomerID = ?)) = 1', [req.params.id, req.params.id, customerID],function (error, results, fields) {
			sendFinalResult(res, error, results);
		});
	});
});


// Get info for a finalized order given the OrderID
router.get("/orders/:id",function(req,res){
	authAndRun(req, res, function(req, res, customerID){
		global.connection.query('SELECT * FROM orders WHERE OrderID = ? AND (OrderPrivacy = 0 OR OrderCustomerID = ?)', [req.params.id, customerID],function (error, results, fields) {
			sendFinalResult(res, error, results);
		});
	});
});

// Get all finalized orders given a CustomerID
router.get("/customers/orders/:id",function(req,res){
	authAndRun(req, res, function(req, res, customerID){
		global.connection.query('SELECT * FROM orders WHERE OrderCustomerID = ? AND OrderFinal = 1 AND (OrderPrivacy = 0 OR OrderCustomerID = ?)', [req.params.id, customerID],function (error, results, fields) {
			sendFinalResult(res, error, results);
		});
	});
});

// Get all finalized orders for all customers that you are following
router.get("/following/orders",function(req,res){
	authAndRun(req, res, function(req, res, customerID){
		global.connection.query('SELECT * FROM orders WHERE OrderCustomerID in (select FollowingID from following where FollowerID = ?) AND OrderFinal = 1 AND OrderPrivacy = 0 ORDER BY OrderDate DESC', [customerID],function (error, results, fields) {
			sendFinalResult(res, error, results);
		});
	});
});

// Get all finalized orders for all customers that you are following
router.get("/following/orders",function(req,res){
	authAndRun(req, res, function(req, res, customerID){
		global.connection.query('SELECT * FROM orders WHERE OrderCustomerID in (select FollowingID from following where FollowerID = ?) AND OrderFinal = 1 AND OrderPrivacy = 0 ORDER BY OrderDate DESC', [customerID],function (error, results, fields) {
			sendFinalResult(res, error, results);
		});
	});
});

// Remove item from active order. id is the ProductID.
router.delete("/orders/products/:id",function(req,res){
	authAndRun(req, res, function(req, res, customerID){
		global.connection.query('SELECT OrderID FROM orders WHERE OrderCustomerID = ? AND OrderFinal = 0', [customerID],function (error, results, fields) {
			if (error){
				res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
				return;
			}
			if(results.length > 0){
				global.connection.query('DELETE FROM orderproducts WHERE OrderID = ? AND ProductID = ? LIMIT 1', [results[0]['OrderID'], req.params.id], function (error, results, fields) {
					sendFinalResult(res, error, results);
				});
			}
			else{
				res.send(JSON.stringify({"status": 404, "error": "No active order found", "response": null}));
				return;
			}
		});
	});
});

// Cancel order within 24 hrs. id is OrderID
router.delete("/orders/:id",function(req,res){
	authAndRun(req, res, function(req, res, customerID){
		global.connection.query('DELETE FROM orders WHERE OrderID = ? AND OrderCustomerID = ? AND OrderDate >= NOW() - INTERVAL 1 DAY', [req.params.id, customerID], function (error, results, fields) {
			sendFinalResult(res, error, results);
		});
	});
});

// Get account details for all customers with partially matching usernames
router.get("/search/:username",function(req,res){
	authAndRun(req, res, function(req, res, customerID){
		global.connection.query('SELECT CustomerID, CustomerFirstName, CustomerLastName, CustomerMiddleInitial, CustomerUsername, CustomerDOB, CustomerPrimaryEmail, CustomerPrimaryPhone FROM customers WHERE CustomerUsername LIKE ?', [req.params.username + '%'], function (error, results, fields) {
			sendFinalResult(res, error, results);
		});
	});
});



// General function for authenticating and running code
// Functorun is the function that should be run if login is successful
// Always need user and pw in query
function authAndRun(req, res, funcToRun){
	global.connection.query('SELECT CustomerPassword, CustomerID FROM customers WHERE CustomerUsername = ?', [req.query.user], function (error, results, fields) {
		if (error){
			res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
			return;
		}
		if (results.length > 0) { // If this username exists
			bcrypt.compare(req.query.pw, results[0].CustomerPassword, function(err, result) {
				if (err){
					res.send(JSON.stringify({"status": 500, "error": "Internal error", "response": null}));
					return;
				}
				if (result == true) { // If password is a match
					funcToRun(req, res, results[0].CustomerID);
				}
				else {
					res.send(JSON.stringify({"status": 401, "error": "Bad password", "response": null}));
				}
			});
		}
		else {
			res.send(JSON.stringify({"status": 401, "error": "Bad username", "response": null}));
		}
	});
}

// General function for if error then 500, else 200 response
function sendFinalResult(res, error, results){
	if (error){
		res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
		return;
	}
	res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
}

// start server running on port 3000 (or whatever is set in env)
app.use(express.static(__dirname + '/'));
app.use("/",router);
app.set( 'port', ( process.env.PORT || config.port || 3000 ));

app.listen(app.get( 'port' ), function() {
	console.log( 'Node server is running on port ' + app.get( 'port' ));
	console.log( 'Environment is ' + env);
});
