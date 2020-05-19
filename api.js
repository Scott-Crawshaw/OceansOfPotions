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
router.post("/customers/signup",function(req,res){
	bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
		if (err){
			res.send(JSON.stringify({"status": 500, "error": "Internal error", "response": null}));
			return;
		}
		global.connection.query('INSERT INTO OceansOfPotions_sp20.customers (`CustomerUsername`, `CustomerPassword`, `CustomerFirstName`, `CustomerLastName`, `CustomerMiddleInitial`, `CustomerDOB`, `CustomerPrimaryEmail`, `CustomerPrimaryPhone`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
			[req.body.user, hash, req.body.fname, req.body.lname, req.body.minitial, req.body.dob, req.body.email, req.body.phone], function (error, results, fields) {
				if (error){
					res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
					return;
				}
				res.send(JSON.stringify({"status": 201, "error": null, "response": results}));
			});
	});
});

// Delete account for existing customer
// Body must include pw, user
router.delete("/customers/delete",function(req,res){
	global.connection.query('SELECT CustomerPassword FROM OceansOfPotions_sp20.customers WHERE CustomerUsername = ?', [req.body.user], function (error, results, fields) {
		if (error){
			res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
			return;
		}
		if (results.length > 0) { // If this username exists
			bcrypt.compare(req.body.pw, results[0].CustomerPassword, function(err, result) {
				if (err){
					res.send(JSON.stringify({"status": 500, "error": "Internal error", "response": null}));
					return;
				}
				if (result == true) { // If password is a match
					global.connection.query('DELETE FROM OceansOfPotions_sp20.customers WHERE CustomerUsername = ?', [req.body.user], function (error, results, fields) {
						if (error){
							res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
							return;
						}
						res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
					});
				}
				else {
					res.send(JSON.stringify({"status": 401}));
				}
			});
		}
		else {
			res.send(JSON.stringify({"status": 401}));
		}
	});
});

// Change account details for existing customer
// Body must include pw, user, modpw, moduser, fname, lname, minitial, dob, email, phone
router.put("/customers/profile/bio/update",function(req,res){
	global.connection.query('SELECT CustomerPassword FROM OceansOfPotions_sp20.customers WHERE CustomerUsername = ?', [req.body.user], function (error, results, fields) {
		if (error){
			res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
			return;
		}
		if (results.length > 0) {
			bcrypt.compare(req.body.pw, results[0].CustomerPassword, function(err, result) {
				if (err){
					res.send(JSON.stringify({"status": 500, "error": "Internal error", "response": null}));
					return;
				}
				if (result == true) {
					bcrypt.hash(req.body.modpw, saltRounds, function(err, hash) {
						if (err){
							res.send(JSON.stringify({"status": 500, "error": "Internal error", "response": null}));
							return;
						}
						global.connection.query('UPDATE OceansOfPotions_sp20.customers SET CustomerUsername = ?, CustomerPassword = ?, CustomerFirstName = ?, CustomerLastName = ?, CustomerMiddleInitial = ?, CustomerDOB = ?, CustomerPrimaryEmail = ?, CustomerPrimaryPhone = ? WHERE CustomerUsername = ?', [req.body.moduser, hash, req.body.fname, req.body.lname, req.body.minitial, req.body.dob, req.body.email, req.body.phone, req.body.user], function (error, results, fields) {
							if (error){
								res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
								return;
							}
							res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
						});
					});
				}
				else {
					res.send(JSON.stringify({"status": 401}));
				}
			});
		}
		else {
			res.send(JSON.stringify({"status": 401}));
		}
	});
});

// View account details for existing customer
router.get("/customers/profile/bio/view/:user/:pw",function(req,res){
	global.connection.query('SELECT CustomerPassword FROM OceansOfPotions_sp20.customers WHERE CustomerUsername = ?', [req.params.user], function (error, results, fields) {
		if (error){
			res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
			return;
		}
		if (results.length > 0) { // If this username exists
			bcrypt.compare(req.params.pw, results[0].CustomerPassword, function(err, result) {
				if (err){
					res.send(JSON.stringify({"status": 500, "error": "Internal error", "response": null}));
					return;
				}
				if (result == true) { // If password is a match
					global.connection.query('SELECT CustomerFirstName, CustomerLastName, CustomerMiddleInitial, CustomerUsername, CustomerDOB, CustomerPrimaryEmail, CustomerPrimaryPhone FROM OceansOfPotions_sp20.customers WHERE CustomerUsername = ?', [req.params.user], function (error, results, fields) {
						if (error){
							res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
							return;
						}
						res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
					});
				}
				else {
					res.send(JSON.stringify({"status": 401}));
				}
			});
		}
		else {
			res.send(JSON.stringify({"status": 401}));
		}
	});
});

// View all other customers/browse users
router.get("/customers/view/:user/:pw",function(req,res){
	global.connection.query('SELECT CustomerPassword, CustomerID FROM OceansOfPotions_sp20.customers WHERE CustomerUsername = ?', [req.params.user], function (error, results, fields) {
		if (error){
			res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
			return;
		}
		if (results.length > 0) { // If this username exists
			customerID = results[0].CustomerID;
			bcrypt.compare(req.params.pw, results[0].CustomerPassword, function(err, result) {
				if (err){
					res.send(JSON.stringify({"status": 500, "error": "Internal error", "response": null}));
					return;
				}
				if (result == true) { // If password is a match
					global.connection.query('SELECT CustomerFirstName, CustomerLastName, CustomerMiddleInitial, CustomerUsername FROM OceansOfPotions_sp20.customers WHERE CustomerID != ?', [customerID], function (error, results, fields) {
						if (error){
							res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
							return;
						}
						res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
					});
				}
				else {
					res.send(JSON.stringify({"status": 401}));
				}
			});
		}
		else {
			res.send(JSON.stringify({"status": 401}));
		}
	});
});

// Follow another customer
// Body must include pw, followeruser, followinguser
router.post("/customers/follow",function(req,res){
	global.connection.query('SELECT CustomerPassword, CustomerID FROM OceansOfPotions_sp20.customers WHERE CustomerUsername = ?', [req.body.followeruser], function (error, results, fields) {
		if (error){
			res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
			return;
		}
		if (results.length > 0) { // If this username exists
			followerID = results[0].CustomerID;
			bcrypt.compare(req.body.pw, results[0].CustomerPassword, function(err, result) {
				if (err){
					res.send(JSON.stringify({"status": 500, "error": "Internal error", "response": null}));
					return;
				}
				if (result == true) { // If password is a match
					global.connection.query('SELECT CustomerID FROM OceansOfPotions_sp20.customers WHERE CustomerUsername = ?', [req.body.followinguser], function (error, results, fields) {
						if (error){
							res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
							return;
						}
						if (results.length > 0) { // If attempting to follow an existing user
							followingID = results[0].CustomerID;
							if (followingID != followerID) { // If not attempting to follow self
								global.connection.query('INSERT INTO OceansOfPotions_sp20.following (`FollowerID`, `FollowingID`) VALUES((SELECT CustomerID FROM OceansOfPotions_sp20.customers WHERE CustomerUsername = ?), (SELECT CustomerID FROM OceansOfPotions_sp20.customers WHERE CustomerUsername = ?))', [req.body.followeruser, req.body.followinguser], function (error, results, fields) {
									if (error){
										res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
										return;
									}
									res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
								});
							}
							else {
								res.send(JSON.stringify({"status": 401}));
							}
						}
						else {
							res.send(JSON.stringify({"status": 401}));
						}
					});
				}
				else {
					res.send(JSON.stringify({"status": 401}));
				}
			});
		}
		else {
			res.send(JSON.stringify({"status": 401}));
		}
	});
});

// Unfollow another customer
// Body must include pw, followeruser, followinguser
router.delete("/customers/unfollow",function(req,res){
	global.connection.query('SELECT CustomerPassword, CustomerID FROM OceansOfPotions_sp20.customers WHERE CustomerUsername = ?', [req.body.followeruser], function (error, results, fields) {
		if (error){
			res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
			return;
		}
		if (results.length > 0) { // If this username exists
			followerID = results[0].CustomerID;
			bcrypt.compare(req.body.pw, results[0].CustomerPassword, function(err, result) {
				if (err){
					res.send(JSON.stringify({"status": 500, "error": "Internal error", "response": null}));
					return;
				}
				if (result == true) { // If password is a match
					global.connection.query('SELECT CustomerID FROM OceansOfPotions_sp20.customers WHERE CustomerUsername = ?', [req.body.followinguser], function (error, results, fields) {
						if (error){
							res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
							return;
						}
						if (results.length > 0) { // If attempting to unfollow an existing user
							followingID = results[0].CustomerID;
							if (followingID != followerID) { // If not attempting to unfollow self
								global.connection.query('DELETE FROM OceansOfPotions_sp20.following WHERE FollowerID = ? AND FollowingID = ?', [followerID, followingID], function (error, results, fields) {
									if (error){
										res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
										return;
									}
									res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
								});
							}
							else {
								res.send(JSON.stringify({"status": 401}));
							}
						}
						else {
							res.send(JSON.stringify({"status": 401}));
						}
					});
				}
				else {
					res.send(JSON.stringify({"status": 401}));
				}
			});
		}
		else {
			res.send(JSON.stringify({"status": 401}));
		}
	});
});

// View a customer's following list
router.get("/customers/profile/following/view/:user/:pw",function(req,res){
	global.connection.query('SELECT CustomerPassword, CustomerID FROM OceansOfPotions_sp20.customers WHERE CustomerUsername = ?', [req.params.user], function (error, results, fields) {
		if (error){
			res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
			return;
		}
		if (results.length > 0) { // If this username exists
			followerID = results[0].CustomerID;
			bcrypt.compare(req.params.pw, results[0].CustomerPassword, function(err, result) {
				if (err){
					res.send(JSON.stringify({"status": 500, "error": "Internal error", "response": null}));
					return;
				}
				if (result == true) { // If password is a match
					global.connection.query('SELECT CustomerFirstName, CustomerLastName, CustomerMiddleInitial, CustomerUsername FROM OceansOfPotions_sp20.customers WHERE CustomerID IN (SELECT FollowingID FROM OceansOfPotions_sp20.following WHERE FollowerID = ?)', [followerID], function (error, results, fields) {
						if (error){
							res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
							return;
						}
						res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
					});
				}
				else {
					res.send(JSON.stringify({"status": 401}));
				}
			});
		}
		else {
			res.send(JSON.stringify({"status": 401}));
		}
	});
});

// View a customer's follower list
router.get("/customers/profile/follower/view/:user/:pw",function(req,res){
	global.connection.query('SELECT CustomerPassword, CustomerID FROM OceansOfPotions_sp20.customers WHERE CustomerUsername = ?', [req.params.user], function (error, results, fields) {
		if (error){
			res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
			return;
		}
		if (results.length > 0) { // If this username exists
			followingID = results[0].CustomerID;
			bcrypt.compare(req.params.pw, results[0].CustomerPassword, function(err, result) {
				if (err){
					res.send(JSON.stringify({"status": 500, "error": "Internal error", "response": null}));
					return;
				}
				if (result == true) { // If password is a match
					global.connection.query('SELECT CustomerFirstName, CustomerLastName, CustomerMiddleInitial, CustomerUsername FROM OceansOfPotions_sp20.customers WHERE CustomerID IN (SELECT FollowerID FROM OceansOfPotions_sp20.following WHERE FollowingID = ?)', [followingID], function (error, results, fields) {
						if (error){
							res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
							return;
						}
						res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
					});
				}
				else {
					res.send(JSON.stringify({"status": 401}));
				}
			});
		}
		else {
			res.send(JSON.stringify({"status": 401}));
		}
	});
});

// start server running on port 3000 (or whatever is set in env)
app.use(express.static(__dirname + '/'));
app.use("/",router);
app.set( 'port', ( process.env.PORT || config.port || 3000 ));

app.listen(app.get( 'port' ), function() {
	console.log( 'Node server is running on port ' + app.get( 'port' ));
	console.log( 'Environment is ' + env);
});
