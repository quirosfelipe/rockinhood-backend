//REQUIRED PACKAGES
const express = require('express')
const morgan = require('morgan');
const cors = require('cors'); 
const { environment } = require('./config');
const app = express();

//ROUTES
const usersRouter = require('./routes/users');
const stocksRouter = require('./routes/stocks');
const transactionsRouter = require('./routes/transactions');
const watchlistsRouter = require('./routes/watchlists')

//USE UTILS
app.use(morgan("dev"));
app.use(express.json());
app.use(cors({ origin: "http://localhost:4000" }));  
//app.use(cors());  


//USE ROUTES
app.use('/users', usersRouter);
app.use('/stocks', stocksRouter);
app.use('/transactions', transactionsRouter);
app.use('/watchlists', watchlistsRouter)


//ERROR HANDLERS BELOW

// ERROR HANDLERS - Catch unhandled requests and throw 404 error
app.use((req, res, next) => {
    const err = new Error("The requested resource couldn't be found.");
    err.status = 404;
    next(err);
});

//ERROR HANDLERS - Custome error handler

// ERROR HANDLERS - Generic error handler
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    const isProduction = environment === "production";
    res.json({
        title: err.title || "Server Error",
        message: err.message,
        errors: err.errors,
        stack: isProduction ? null : err.stack,
    });
});

module.exports = app;