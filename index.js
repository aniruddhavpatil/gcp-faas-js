// const url = "https://us-central1-faas-297303.cloudfunctions.net/hello_faas_world";
const url = "https://us-central1-faas-297303.cloudfunctions.net/process_sentences"
// const response = [[1, 87], [2, 193], [3, 56], [4, 46], [5, 69], [6,
// 71], [7, 219], [8, 123], [9, 105], [10, 138], [11, 138], [12, 164], [13, 196], [14, 169], [15, 189], [16, 189], [17,
// 186], [18, 193], [19, 167], [20, 116], [21, 92], [22, 105], [23, 124], [24, 128], [25, 113], [26, 127], [27, 134], [28,
// 128], [29, 93], [30, 120], [31, 108], [32, 123], [33, 98], [34, 94], [35, 80], [36, 88], [37, 86], [38, 66], [39, 61],
// [40, 61], [41, 60], [42, 50], [43, 51], [44, 53], [45, 59], [46, 62], [47, 63], [48, 67], [49, 53], [50, 44], [51, 50],
// [52, 46], [53, 28], [54, 29], [55, 48], [56, 36], [57, 29], [58, 31], [59, 35], [60, 24], [61, 27], [62, 35], [63, 31],
// [64, 31], [65, 25], [66, 32], [67, 18], [68, 13], [69, 17], [70, 13], [71, 20], [72, 10], [73, 16], [74, 15], [75, 17],
// [76, 15], [77, 10], [78, 17], [79, 18], [80, 14], [81, 12], [82, 13], [83, 9], [84, 9], [85, 11], [86, 7], [87, 11],
// [88, 6], [89, 6], [90, 9], [91, 8], [92, 7], [93, 4], [94, 12], [95, 8], [96, 3], [97, 5], [98, 4], [99, 7], [100, 3],
// [101, 5], [102, 3], [103, 2], [104, 2], [105, 3], [106, 1], [107, 3], [108, 2], [109, 4], [110, 2], [111, 1], [112, 2],
// [113, 1], [114, 4], [115, 1], [116, 5], [117, 3], [119, 2], [120, 2], [121, 1], [123, 2], [126, 2], [127, 2], [129, 3],
// [130, 3], [131, 1], [132, 1], [133, 1], [136, 3], [137, 2], [139, 1], [140, 1], [141, 1], [144, 1], [146, 1], [148, 1],
// [151, 1], [153, 1], [162, 3], [163, 1], [165, 1], [171, 1], [174, 1], [177, 1], [178, 1], [182, 1], [724, 1]];


function httpGetAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

function httpPost(url, value) {
    // let data = {element: "barium"};
    // var data = {
    //     "message": value
    // }

var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({"message": value});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch(url, requestOptions)
  .then(response => response.text())
  .then(result => {
    //   console.log('httpPost response:',result);
      plotHistogram(result);
  })
  .catch(error => console.log('error', error));


    // fetch(url, {
    // method: "GET", 
    // // body: JSON.stringify(data)
    // }).then(res => {
    // console.log("Request complete! response:", res);
    // });
}


function callback(value) {
    // var x = document.querySelector("#book_text");
    // x.innerHTML = value;
    console.log(value);
    plotHistogram(value);
}

function myFunction() {
        var x = document.querySelector("#frm1 input");
        console.log(x.value);
        httpPost(url, x.value);

        // httpGetAsync(x.value, callback);
    }


function plotHistogram(response) {
// set the dimensions and margins of the graph
const res = JSON.parse(response);
console.log('plotHistogram', res)
console.log()
var counts = res.counts;
console.log(counts);
var data = []
counts.map(e => {
    for (var i = 0; i < e[1]; i++){
        data.push(e[0]);
    }
})
console.log(data.length)
var margin = {top: 10, right: 30, bottom: 30, left: 40},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// get the data
// d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/1_OneNum.csv", function(data) {
//     console.log(data)
  // X axis: scale and draw:


  var x = d3.scaleLinear()
      .domain([0, 200])     // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
      .range([0, width]);
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // set the parameters for the histogram
  var histogram = d3.histogram()
      .value(function(d) { return d; })   // I need to give the vector of value
      .domain(x.domain())  // then the domain of the graphic
      .thresholds(x.ticks(200)); // then the numbers of bins

  // And apply this function to data to get the bins
  var bins = histogram(data);

  // Y axis: scale and draw:
  var y = d3.scaleLinear()
      .range([height, 0]);
      y.domain([0, d3.max(bins, function(d) { return d.length; })]);   // d3.hist has to be called before the Y axis obviously
  svg.append("g")
      .call(d3.axisLeft(y));

  // append the bar rectangles to the svg element
  svg.selectAll("rect")
      .data(bins)
      .enter()
      .append("rect")
        .attr("x", 1)
        .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
        .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
        .attr("height", function(d) { return height - y(d.length); })
        .style("fill", "#69b3a2")

// });
}