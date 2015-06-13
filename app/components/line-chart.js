import Ember from "ember";
import Chart from "../mixins/chart";
var computed = Em.computed;

// TODO: remove duplication with histogram-chart
function _chartDivWidth(element) {
  return parseInt((element).style("width"), 10);
}

var n_days = 7;  // TODO un-hardcode

export default Ember.Component.extend(Chart, {

  chartElement: computed("elementId", function() {
    return "#" + this.get("elementId") + " .chart";
  }),
  didInsertElement(){

    this.set("chartDivWidth",
      _chartDivWidth(d3.select(this.get("chartElement")))
    );
    this.set("chartDivHeight", 250);
    this.set("xAxisRoom", 13);
    this.set("yAxisRoom", 25);

    var color = d3.scale.ordinal()
      .range(this.get("colorPalette"));

    var margin = this.get("margin")(
      this.get("xAxisRoom"),
      this.get("yAxisRoom")
    );

    var plotWidth = this.get("chartDivWidth") - margin.left - margin.right,
        plotHeight = this.get("chartDivHeight") - margin.top - margin.bottom;

  }
});

    // var data = this.get("data").processed.map(function(d) {
    //   d.date = d3.time.format(this.get("formatDateKeen")).parse(d.timeframe.start);
    //   return d;
    // });

    // var x = d3.time.scale()
    //   .domain(d3.extent(data, function(d) { return d.date; }))
    //   .range([0, plotWidth - this.get("paddingRight")]);

    // var y = d3.scale.linear()
    //   .domain([0, d3.max(data, function(d) { return d.value; })])
    //   .range([plotHeight, 0 + this.get("paddingTop")]);

    // var xAxis = d3.svg.axis()
    //   .scale(x)
    //   .orient("bottom")
    //   .ticks(n_days)
    //   .tickFormat(this.get("formatDateDisplay"))
    //   .tickSubdivide(0);

    // var yAxis = d3.svg.axis()
    //   .scale(y)
    //   .orient("left")
    //   .ticks(4)
    //   .tickFormat(this.get("formatCount"))
    //   .tickSubdivide(0);


    // var line = d3.svg.line()
    //   .x(function(d) { return x(d.date); })
    //   .y(function(d) { return y(d.value); });

    // var svg = d3.select(destinationElementId).append("svg")
    //   .attr("width", width + margin.left + margin.right)
    //   .attr("height", height + margin.top + margin.bottom)
    // .append("g")
    //   .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // svg.append("path")
    //   .datum(data)
    //   .attr("class", "line")
    //   .style("stroke", color[0])
    //   .attr("d", line);

    // svg.append("g")
    //   .attr("class", "x axis")
    //   .attr("transform", "translate(0," + height + ")")
    //     .call(xAxis);

    // svg.append("g")
    //     .attr("class", "y axis")
    //     .call(yAxis);

