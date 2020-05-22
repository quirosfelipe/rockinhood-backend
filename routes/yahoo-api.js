//REQUIRED PACKAGES
const unirest = require("unirest");

const stockHistoricalPrices = async(ticker, days, cb ) => {

    const secondsInDay = (60 * 60 *24);
    const endDate = Math.floor(Date.now() / 1000) - secondsInDay;
    const startDate = endDate - ((secondsInDay * (days)));
    let data;
    //console.log(ticker, ((endDate-startDate)/secondsInDay));

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
    try {
    req.end( (res) => {
        if (res.error) {
            throw new Error(res.error);
        } else {
            data = res.body.prices.map((price) => ({ date: new Date(price.date * 1000), value: price.close }));
            data = data.reverse();
            //console.log(data);
            cb(data);
        }
    });
    } catch (error) {
        console.error(error.status);
        console.error("Too many requests to yahoo finance API")
    };
}

const getNewsList = async (cb) => {
    const req = unirest("GET", "https://apidojo-yahoo-finance-v1.p.rapidapi.com/news/list");
    req.query({
        "category": "generalnews",
        "region": "US"
    });
    req.headers({
        "x-rapidapi-host": "apidojo-yahoo-finance-v1.p.rapidapi.com",
        "x-rapidapi-key": "c26becff69msh1653681ffa89790p14fa58jsn85f60361188a",
        "useQueryString": true
    });
    try {
    req.end(function (res) {
        if (res.error) throw new Error(res.error);
        cb(res.body);
    });
    } catch (error) {
        console.error(error.status);
        console.error("Too many requests to yahoo finance API")
    };
};

// const getNews = async (cb) => {
//     const req = unirest("GET", "https://apidojo-yahoo-finance-v1.p.rapidapi.com/news/get-details");
//     req.query({
//         "uuid": "375879c0-08f3-32fb-8aaf-523c93ff8792"
//     });
//     req.headers({
//         "x-rapidapi-host": "apidojo-yahoo-finance-v1.p.rapidapi.com",
//         "x-rapidapi-key": "c26becff69msh1653681ffa89790p14fa58jsn85f60361188a",
//         "useQueryString": true
//     });
//     req.end(function (res) {
//         if (res.error) throw new Error(res.error);
//         cb(res.body);
//     });
// };




module.exports = { stockHistoricalPrices, getNewsList };
