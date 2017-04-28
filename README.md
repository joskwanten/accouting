## accouting

To get some experience with event sourcing and CQRS, this is a little experiment to 
create an doule-entry accounting system. The first version is very basic and stores
its events in a flat file. It is not jet able to replay events and its read-model is
a simple in memory object.

The application is a simple nodejs application based on express. To build the application,
simply clone the repo, go to te src folder and execute the following commands:
'''bash
> npm install
> npm start
'''

When the application runs, one can post journals on http://localhost:3000/api/journal.
A journal consists of an array of bookrows. Below an example a valid journal:

[{
	"amount": -12000,
	"account": "debtors",
	"description": "Invoice 1 January"
}, {
	"amount": 10000,
	"account": "Income.Consultancy",
	"description": "Invoice 1 January"
}, {
	"amount": 2000,
	"account": "VAT.Sales",
	"description": "Invoice 1 January"
}]

Non-existing accounts are automatically created and the when posted, it is checked that
the sum of the entries is zero.

The balance of the accounts can be queried on http://localhost:3000/api/accounts
