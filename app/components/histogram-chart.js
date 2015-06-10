import Ember from "ember";
import Chart from "../mixins/chart";
var computed = Em.computed;

function drawXAxis(axis, target, height) {
  target.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0, " + height + ")")
    .call(axis);
}

function drawYAxis(axis, target) {
  target.append("g")
    .attr("class", "y axis")
    .call(axis);
}

export default Ember.Component.extend(Chart, {

  chartElement: computed("elementId", function() {
    return "#" + this.get("elementId") + " .chart";
  }),
  didInsertElement(){

    var color = d3.scale.ordinal()
      .range(this.get("colorPalette"));
    
    var maxValue = Math.max.apply(null, this.get("data").melted);

    var chartWidth = parseInt(d3.select(this.get("chartElement")).style("width"), 10);
    var chartHeight = 250;

    var xAxisRoom = 13;
    var yAxisRoom = 20;

    var margin = this.get("margin")(xAxisRoom, yAxisRoom);

    var width = chartWidth - margin.left - margin.right,
        height = chartHeight - margin.top - margin.bottom;

    var nBins = Math.min(maxValue + 1, width / 20);

    var x = d3.scale.linear()
        .domain([0, maxValue + 1])
        .range([0, width - this.get("paddingRight")]);

    // Generate a histogram using n uniformly-spaced bins.
    var data = d3.layout.histogram()
        .bins(x.ticks(nBins))
        (this.get("data").melted);

    var y = d3.scale.linear()
        .domain([0, d3.max(data, function(d) { return d.y; })])
        .range([height, 0 + this.get("paddingTop")]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .ticks(nBins);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(4)
        .tickFormat(this.get("formatCount"))
        .tickSubdivide(0);

    var svg = d3.select(this.get("chartElement")).append("svg")
        .attr("width", width + margin.left)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var bar = svg.selectAll(".bar")
      .data(data)
    .enter().append("g")
      .attr("class", "bar")
      .style("fill", function(d) { return color(d[0]); })
      .attr("transform", function(d) { return "translate(" + x(d.x) + ", " + y(d.y) + ")"; });

    bar.append("rect")
        .attr("x", 1)
        .attr("width", function(d) { return x(d.dx) - 1; })
        .attr("height", function(d) { return height - y(d.y); });

    drawXAxis(xAxis, svg, height);
    drawYAxis(yAxis, svg);

  }

});