//REQUIRED PACKAGES
const unirest = require("unirest");

const stockHistoricalPrices = (ticker, days) => {

    const secondsInDay = (60 * 60 *24);
    const endDate = Math.floor(Date.now() / 1000) - secondsInDay;
    const startDate = endDate - ((secondsInDay * (days + 1)));

    console.log(ticker, ((endDate-startDate)/secondsInDay));

    const req = unirest("GET", "https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-historical-data");
    req.query({
        "frequency": "1d",
        "filter": "history",
        "period1": `${startDate}`,  //REQUIRED Epoch timestamp in seconds 
        "period2": `${endDate}`,  //REQUIRED Epoch timestamp in seconds
        "symbol": `${ticker}`
    });
    req.headers({
        "x-rapidapi-host": "apidojo-yahoo-finance-v1.p.rapidapi.com",
        "x-rapidapi-key": "c26becff69msh1653681ffa89790p14fa58jsn85f60361188a",
        "useQueryString": true
    });
    req.end( res => {
        if (res.error) throw new Error(res.error);
        //console.log(res.body);
        const data = res.body.prices.map( (price) => ([price.date, price.close]));
        console.log(data);
    });
}

stockHistoricalPrices("AAPL", 6);