var Crawler = require("crawler");

var c = new Crawler({
    maxConnections: 10,
    // This will be called for each crawled page
    callback: function(error, res, done) {
        if (error) {
            console.log(error);
        } else {
            var $ = res.$;
            // $ is Cheerio by default
            //a lean implementation of core jQuery designed specifically for the server
            console.log($(".sellListContent a").attr("href"));
        }
        done();
    }
});

var rootUrl = "https://sh.lianjia.com";

var handleDistrictPage = function(error, res, done) {
    var $ = res.$;
    var districtList = $(
        ".position div[data-role=ershoufang] div:first-child"
    ).children();
    for (let i = 0; i < districtList.length; i++) {
        districtUrl = rootUrl + districtList[i].attribs["href"];
        c.queue([{
            uri: districtUrl,
            callback: handleVillagePage
        }]);
    }
    done();
};

var handleVillagePage = function(error, res, done) {
    var $ = res.$;
    var districtList = $(
        ".position div[data-role=ershoufang] div:last-child"
    ).children();
    done();
};

var handleHousePage = function(error, res, done) {
    var $ = res.$;
    done();
};

c.queue([{
    uri: rootUrl + "/ershoufang/",
    callback: handleDistrictPage
}]);