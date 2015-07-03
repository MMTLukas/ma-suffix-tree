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
console.log("Read books...")

async.eachSeries(
  ['books/pg108.txt', 'books/pg244.txt', 'books/pg1661.txt', 'books/pg2097.txt', 'books/pg2852.txt'],
  function (filename, cb) {
    fs.readFile(filename, function (err, data) {
      console.log("\tRead file ", filename);

      if (!err) {
        books.push(data);
      }

      // Calling cb makes it go to the next item.
      cb(err);
    });
  },
  function (err) {
    startMeasurement();
  }
);

/**
 * MEASURMENT
 */

var startMeasurement = function () {
  var measurementsAllSizes = [];
  for (var i = 0; i < 5; i++) {
    console.log("Build tree with the first ", i + 1, " books...");

    var measurementOneSize = [];
    var text = books.slice(0, i + 1).join("§");
    var tree;

    console.log("\tWith text length ", text.length, "\n\tMeasurment...");
    for (var j = 0; j < 1; j++) {
      console.log("\t\tMeasurment number ", j, "...");

      var timeStart = process.hrtime();

      tree = Ukkonen.buildSuffixTree(text);

      var duration = process.hrtime(timeStart);
      var durationNanoSeconds = duration[0] * Math.pow(10, 9) + duration[1];
      measurementOneSize.push(durationNanoSeconds);

      console.log("\t\t\tDuration ", durationNanoSeconds);
    }

    var average = Math.ceil(Math.average(measurementOneSize));
    measurementsAllSizes.push(average);
    console.log("\tMean Duration", average);

    console.log("\tFind longest repeated substrings...");
    var subStrings = tree.findLongestRepeatedSubstrings(3);
    //console.log("top substrings", subStrings);
    writeSubStringsToTextFiles(subStrings, i);
  }
  console.log("\tAll Duration", measurementsAllSizes);
};

Math.average = function (array) {
  var average = 0;
  for (var i = 0; i < array.length; i++) {
    average += array[i];
  }
  return average / array.length;
};

/**
 * Write results to file
 */
var writeSubStringsToTextFiles = function(subStrings, n){
  for(var i = 0; i<subStrings.length; i++){
    var idx = i;
    fs.writeFile("substrings/substring_books_" + (n+1) + "_with_" + (idx+1) + "_longest.txt", subStrings[idx], function(err) {
      if(err) {
        return console.log(err);
      }

      console.log("Saved file substring_books_" + (n+1) + "_with_" + (idx+1) + "_longest.txt");
    });
  }
};

