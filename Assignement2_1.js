// 1) Object creation

//Object Literal
const salesMan = {
    firstName: "John",
    lastName: "Doe",
    employee_id: 9999,
    nationality: "German",
    performanceRecords: []
};

// Constructor function
function SalesMan(firstName, lastName, employee_id) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.employee_id = employee_id;
    this.performanceRecords = [];
}
SalesMan.prototype.addRecord = function(record){ this.performanceRecords.push(record); };

const s = new SalesMan("Jane","Smith", 101);

// ES6 class
class SalesMan {
    constructor(firstName, lastName, employee_id) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.employee_id = employee_id;
        this.performanceRecords = [];
    }

    addPerformanceRecord(record) {
        this.performanceRecords.push(record);
    }
}
var s = new SalesMan("Jane","Smith", 101);
s.addPerformanceRecord("Jane");
console.log(s.performanceRecords[0]);
//*****************************************************************************************************

//*****************************************************************************************************
// 2) Functions and callbacks (and the “Pyramid of Doom”)
//Function:
function fun(param1) {
    console.log(param1);
}
fun(1);

//A callback is a function that is passed as an argument to another function and is executed later.
function doSomething(callback) {
    console.log("Doing something...");
    callback(); // Run the function that was passed in
}

function f() {console.log("This is the callback function!");
}
doSomething(f);

// callback style -> nested callbacks
db.collection('salesmen').findOne({ employee_id: 101 }, function(err, doc) {
    if (err) throw err;
    db.collection('other').findOne({ id: doc.someId }, function(err2, o) {
        if (err2) throw err2;
        // keeps nesting...
    });
});
// Pyramid shape --> hard to read, debug
task1(function() {
    task2(function() {
        task3(function() {
            task4(function() {
                // too deeply nested...
            });
        });
    });
});
//*****************************************************************************************************

//*****************************************************************************************************
/* 3) Promises (including error handling)
A Promise is an object that represents a task that happens in the future like finding a document in a DB.

It can have 3 states:
 Pending → Still working.
 Fulfilled → Finished successfully.
 Rejected → Failed with an error.

.then() is used to handle the result when a Promise is fulfilled.
.catch() is used to handle the error when a Promise is rejected.
 */

function findSalesman(collection, employeeId) {
    return collection.findOne({ employee_id: employeeId });
}

// Usage with then/catch:
findSalesman(collection, 101)
    .then(function(doc) {
        if (!doc) throw new Error("not found");
        console.log("found", doc.firstName);
    })
    .catch(function(err) {
        console.error("error", err);
    });
//*****************************************************************************************************

//*****************************************************************************************************
//4) async / await
// Modern and readable — implicitly works with Promises.
// Async/await statements make working with Promises simpler, cleaner, and easier to debug. All code can be put into the
// try block without having to create multiple functions. In addition the code is still non-blocking, meaning the program
// doesn't have to wait for a long operation (e.g. reading a DB) to finish before it continues executing other code.

async function getSalesmanById(collection, employeeId) {
    try {
        const doc = await collection.findOne({ employee_id: employeeId });
        if (!doc) return null;
        return doc;
    } catch (err) {
        console.error("DB error", err);
        throw err;
    }
}
//call
(async function(){
    const s = await getSalesmanById(collection, 101);
    console.log(s);
})();
//*****************************************************************************************************

//*****************************************************************************************************
//5) REST-based interface with Express.js
const express = require('express');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const app = express();
app.use(express.json());

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri, { useUnifiedTopology: true });
let collection;

async function start() {
    await client.connect();
    const db = client.db('SmartHooverDB');
    collection = db.collection('data');
    app.listen(3000, () => console.log('Server listening on port 3000'));
}

start().catch(console.error);

// GET salesman by employee_id
app.get('/salesman/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const doc = await collection.findOne({ employee_id: id });
    if (!doc) return res.status(404).json({ error: 'not found' });
    res.json(doc);
});
//*****************************************************************************************************

//*****************************************************************************************************
// 6) Consuming REST with Axios (GET)

const axios = require('axios');

async function fetchSalesman(id) {
    try {
        const r = await axios.get(`http://localhost:3000/salesman/${id}`);
        console.log('Salesman:', r.data);
    } catch (err) {
        if (err.response) console.error('API error', err.response.status);
        else console.error('Network error', err.message);
    }
}
// Example usage
fetchSalesman(9999);
//*****************************************************************************************************

//*****************************************************************************************************
// 7) Handling cookies in Express.js

// set cookie
app.get('/set-cookie', (req, res) => {
    res.cookie('lastViewed', '9999', { httpOnly: true, maxAge: 3600 * 1000 });
    res.send('cookie set');
});

// read cookie
app.get('/who', (req, res) => {
    const last = req.cookies.lastViewed;
    res.send(`last viewed salesman: ${last || 'none'}`);
});

// delete cookie
app.get('/clear-cookie', (req, res) => {
    res.clearCookie('lastViewed');
    res.send('cookie cleared');
});
//*****************************************************************************************************

//*****************************************************************************************************
// 8) Module for calculating bonus salary - check bonusCalculator.js
// importing the module
const { calculateBonus } = require('./bonusCalculator');
//*****************************************************************************************************

//*****************************************************************************************************
// 9) Observer-Pattern using RxJS
// implementation in module bonusWatcher - usage here:
const { publishBonus, subscribe } = require('./bonusWatcher');

const sub = subscribe(evt => {
    console.log('Bonus event received:', evt);
    // maybe send email / persist audit
});

publishBonus({ employee_id: 9999, year: 2025, suggestedBonus: 1500 });
sub.unsubscribe(); // when you want to stop listening

//*****************************************************************************************************

//*****************************************************************************************************
// 10) Definitions
// 1.   (source:https://www.w3schools.com/js/js_control_flow.asp)
//      "JavaScript Asynchronous Flow refers to how JavaScript handles tasks that take time to complete, like reading files,
//      or waiting for user input, without blocking the execution of other code. To prevent blocking, JavaScript can
//      use asynchronous programming. This allows certain operations to run in the background, and their results are
//      handled later, when they are ready."
// 2.   (source:https://blog.openreplay.com/concurrency-vs-parallelism-in-javascript/)
//      "What is Parallelism in JavaScript?
//          Parallelism allows for the simultaneous execution of multiple tasks across several threads, which differs from concurrency,
//          which manages task execution in an overlapping manner. It is like having multiple tabs opened in your browser.
//          Each tab operates independently and can perform tasks without waiting for the others to finish.
//          In other words, concurrency deals with managing lots of things at once by handling each task one at a time,
//          while parallelism typically involves doing several tasks at once."
// 3.  Multithreading: (source: https://www.geeksforgeeks.org/javascript/mutlithreading-in-javascript/ )
//      "Multithreading is the ability of any program to execute multiple threads simultaneously. As we know JavaScript is
//      a single-threaded programming language, which means it has a single thread that handles all the execution sequentially.
//      Single-threaded means one line of code run at once. Originally, Javascript is single-threaded because it was just used
//      in web browser scripting language for a single user but nowadays it evolve into something bigger and make the computation very huge."