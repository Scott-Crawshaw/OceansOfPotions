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
router.post("/customers/signup/:user/:pw/:fname/:lname/:minitial/:dob/:email/:phone",function(req,res){
	bcrypt.hash(req.params.pw, saltRounds, function(err, hash) {
		if (err) throw err;
		global.connection.query('INSERT INTO OceansOfPotions_sp20.customers (`CustomerUsername`, `CustomerPassword`, `CustomerFirstName`, `CustomerLastName`, `CustomerMiddleInitial`, `CustomerDOB`, `CustomerPrimaryEmail`, `CustomerPrimaryPhone`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
			[req.params.user, hash, req.params.fname, req.params.lname, req.params.minitial, req.params.dob, req.params.email, req.params.phone], function (error, results, fields) {
				if (error) throw error;
				res.send(JSON.stringify({"status": 201, "error": null, "response": results}));
			});
	});
});

// Change account details for existing customer
router.put("/customers/profile/bio/update/:user/:pw/:moduser/:modpw/:fname/:lname/:minitial/:dob/:email/:phone",function(req,res){
	global.connection.query('SELECT CustomerPassword FROM OceansOfPotions_sp20.customers WHERE CustomerUsername = ?', [req.params.user], function (error, results, fields) {
		if (error) throw error;
		if (results.length > 0) {
			bcrypt.compare(req.params.pw, results[0].CustomerPassword, function(err, result) {
				if (err) throw err;
				if (result == true) {
					bcrypt.hash(req.params.modpw, saltRounds, function(err, hash) {
						if (err) throw err;
						global.connection.query('UPDATE OceansOfPotions_sp20.customers SET CustomerUsername = ?, CustomerPassword = ?, CustomerFirstName = ?, CustomerLastName = ?, CustomerMiddleInitial = ?, CustomerDOB = ?, CustomerPrimaryEmail = ?, CustomerPrimaryPhone = ? WHERE CustomerUsername = ?', [req.params.moduser, hash, req.params.fname, req.params.lname, req.params.minitial, req.params.dob, req.params.email, req.params.phone, req.params.user], function (error, results, fields) {
							if (error) throw error;
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
		if (error) throw error;
		if (results.length > 0) { // If this username exists
			bcrypt.compare(req.params.pw, results[0].CustomerPassword, function(err, result) {
				if (err) throw err;
				if (result == true) { // If password is a match
					global.connection.query('SELECT CustomerFirstName, CustomerLastName, CustomerMiddleInitial, CustomerUsername, CustomerDOB, CustomerPrimaryEmail, CustomerPrimaryPhone FROM OceansOfPotions_sp20.customers WHERE CustomerUsername = ?', [req.params.user], function (error, results, fields) {
						if (error) throw error;
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