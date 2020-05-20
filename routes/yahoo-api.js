//REQUIRED PACKAGES
const unirest = require("unirest");

const stockHistoricalPrices = async(ticker, days, cb ) => {

    const secondsInDay = (60 * 60 *24);
    const endDate = Math.floor(Date.now() / 1000) - secondsInDay;
    const startDate = endDate - ((secondsInDay * (days + 1)));
    let data;
    console.log(ticker, ((endDate-startDate)/secondsInDay));

    const req = unirest("GET", "https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-historical-data");
    req.query({
        "frequency": "1d",
        "filter": "history",
        "period1": `${startDate}`,  
        "period2": `${endDate}`,
        "symbol": `${ticker}`
    });
    req.headers({
        "x-rapidapi-host": "apidojo-yahoo-finance-v1.p.rapidapi.com",
        "x-rapidapi-key": "c26becff69msh1653681ffa89790p14fa58jsn85f60361188a",
        "useQueryString": true
    });
    req.end( (res) => {
        if (res.error) {
            throw new Error(res.error);
        } else {
            data = res.body.prices.map((price) => ([new Date(price.date * 1000), price.close]));
            cb(data);
        }
    });
}

//stockHistoricalPrices("AAPL", 6);
module.exports = { stockHistoricalPrices };

