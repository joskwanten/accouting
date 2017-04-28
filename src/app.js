'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const fs = require('fs');

const journal = 'data/journal.txt';
const port = 3000;

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Static content
app.use(express.static('public'))

// Router for /api
// get an instance of the express Router
let router = express.Router();

let accounts = {};

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function (req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});


router.get('/accounts', function (req, res) {
    res.json(accounts);
});

router.post('/journal', function (request, response) {
    console.log("Received JSON: " + request.body);

    // Check if the command is valid. This is a double-entry accouting system
    // so the journal must be in balance (sum of all transactions must be zero)
    if (request.body.reduce((a, b) => { return { amount: (a.amount + b.amount) } }).amount === 0) {
        console.log("Journal is correct, command accepted");

        // TODO: Generate event with a pub/sub mechanism, one of the subscribers is the journal writer
        //  and the other is the read model
        fs.appendFileSync(journal, JSON.stringify(request.body) + "\n");

        // Update the account information
        updateAccounts(request.body);

    }

    response.send(request.body);    // echo the result back
});

// more routes for our API will happen here


// all of our routes will be prefixed with /api
app.use('/api', router);

// Start the server
app.listen(port);

console.log('Application is running on ' + port);

function updateAccounts(journal) {
    journal.forEach(row => {
        if (accounts[row.account] == null) {
            accounts[row.account] = row.amount;
        } else {
            accounts[row.account] += row.amount;
        }
    });
}