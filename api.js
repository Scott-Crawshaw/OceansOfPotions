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
router.get("/customers/:user",function(req,res){
	authAndRun(req, res, function(req, res, customerID){
		global.connection.query('SELECT CustomerID, CustomerFirstName, CustomerLastName, CustomerMiddleInitial, CustomerUsername, CustomerDOB, CustomerPrimaryEmail, CustomerPrimaryPhone FROM customers WHERE CustomerID = ?', [req.params.user], function (error, results, fields) {
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
		console.log(customerID);
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
