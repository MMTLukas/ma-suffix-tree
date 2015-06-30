/**
 * Suffix-Tree Implementation for Node.JS
 * Wanko Lukas
 **/

var fs = require('fs');
var async = require('async');

var Ukkonen = require('./libs/Ukkonen');

/**
 * READ BOOKS
 */

var books = [];
async.eachSeries(
  ['books/pg108.txt', 'books/pg244.txt', 'books/pg1661.txt', 'books/pg2097.txt', 'books/pg2852.txt'],
  function (filename, cb) {
    fs.readFile(filename, function (err, data) {
      console.log("Read file ", filename);
      
      if (!err) {
        books.push(data);
      }

      // Calling cb makes it go to the next item.
      cb(err);
    });
  },
  function(err) {
    startMeasurment();
  }
);

/**
 * MEASURMENT
 */

var startMeasurment = function () {
  var measurmentsAllSizes = [];
  for (var i = 0; i < 5; i++) {

    console.log("Build tree with the first ", i+1, " books...");
    var measurmentOneSize = [];
    var text = books.slice(0, i+1).join("Ö")

    for (var j = 0; j < 5; j++) {
      console.log("Measurment number ", j, "...")
      var timeStart = process.hrtime();

      Ukkonen.buildSuffixTree(text).print();

      var duration = process.hrtime(timeStart);
      var durationNanoSeconds = duration[0] * Math.pow(10, 9) + duration[1];
      measurmentOneSize.push(durationNanoSeconds);
    }

    var average = Math.ceil(Math.average(measurmentOneSize));
    measurmentsAllSizes.push(average);
  }
  console.log(measurmentsAllSizes)
};

Math.average = function (array) {
  var average = 0;
  for (var i = 0; i < array.length; i++) {
    average += array[i];
  }
  return average / array.length;
};