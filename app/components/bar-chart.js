import Ember from "ember";
import Chart from "../mixins/chart";
var computed = Em.computed;

function _drawBars(data, groupBy, xScale, yScale, target, height, colorScale) {

  var bar = target.selectAll(".bar")
    .data(data)
    .enter()
  .append("g")
    .attr("class", "bar")
    .style("fill", function(d, i) { return colorScale(i); })
    .attr("transform", function(d) {
      return "translate(0, " + yScale(d[groupBy]) + ")";
    });

  bar.append("rect")
      .attr("x", 1)
      .attr("width", function(d) { return xScale(d.result); })
      .attr("height", yScale.rangeBand);

}

export default Ember.Component.extend(Chart, {

  chartDivWidth: computed("chartElement", function() {
    return parseInt(d3.select(this.get("chartElement")).style("width"), 10);
  }),

  chartElement: computed("elementId", function() {
    return "#" + this.get("elementId") + " .chart";
  }),

  groupBy: computed("data", function() {
    return this.get("data").specs.queryParams.groupBy;
  }),

  titleString: computed("data", function() {
    var spec = this.get("data").specs;
    return spec.queryType +
      " " + spec.queryParams.targetProperty +
      " in " + spec.queryParams.eventCollection +
      " by " + spec.queryParams.groupBy;
  }),

  didInsertElement(){

    this.set("chartDivHeight", 250);
    this.set("xAxisRoom", 13);
    this.set("yAxisRoom", 78);
    this.set("maxBars", 12);

    var color = d3.scale.ordinal()
      .range(this.get("colorPalette"));

    var margin = this.get("margin")(
      this.get("xAxisRoom"),
      this.get("yAxisRoom")
    );

    var plotWidth = this.get("chartDivWidth") - margin.left - margin.right,
        plotHeight = this.get("chartDivHeight") - margin.top - margin.bottom;

    var groupBy = this.get("groupBy");

    // TODO: this should go in route
    var data = this.get("data").processed.sort(
      function (a, b) {
        if (a.result > b.result) {
          return -1;
        }
        if (a.result < b.result) {
          return 1;
        }
        // a must be equal to b
        return 0;
      })
        .filter(function(value) { return value[groupBy] !== null; })
        .slice(0, this.get("maxBars"));

    var x = d3.scale.linear()
        .domain([0, d3.max(data, function(d) { return d.result; })])
        .range([0, plotWidth]);

    var y = d3.scale.ordinal()
        .domain(data.map(function(d) { return d[groupBy]; }))
        .rangeRoundBands([0, plotHeight], 0.1);

    var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .ticks(4)
      .tickFormat(this.get("formatCount"))
      .tickSubdivide(0);

    var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .ticks(data.length);

    var svg = this.get("drawSvg")(this.get("chartElement"), plotWidth, plotHeight, margin);

    _drawBars(data, this.get("groupBy"), x, y, svg, plotHeight, color);
    this.get("drawXAxis")(xAxis, svg, plotHeight);
    this.get("drawYAxis")(yAxis, svg, this.get("yAxisRoom"));
    this.get("drawTitle")(this.get("titleString"), this.element);

    // NEXT: TDD the truncate function
  }
});
