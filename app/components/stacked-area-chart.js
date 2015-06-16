import Ember from "ember";
import Chart from "../mixins/chart";
var computed = Em.computed;

function _drawLine(data, xScale, yScale, target, color) {

  var line = d3.svg.line()
    .x(function(d) { return xScale(d.date); })
    .y(function(d) { return yScale(d.value); });

  target.append("path")
    .datum(data)
    .attr("class", "line")
    .style("stroke", color)
    .style("stroke-width", 2) // TODO handle in css?
    .style("fill", "none")
    .attr("d", line);
}

export default Ember.Component.extend(Chart, {

  chartDivWidth: computed("chartElement", function() {
    return parseInt(d3.select(this.get("chartElement")).style("width"), 10);
  }),

  chartElement: computed("elementId", function() {
    return "#" + this.get("elementId") + " .chart";
  }),

  titleString: computed("data", function() {
  var spec = this.get("data").specs;
  return spec.queryType +
    " " + spec.queryParams.targetProperty +
    " in " + spec.queryParams.eventCollection +
    " by " + spec.queryParams.groupBy +
    " " + spec.queryParams.interval +
    " over " + spec.queryParams.timeframe;
  }),

  didInsertElement(){

    this.set("chartDivHeight", 250);
    this.set("xAxisRoom", 13);
    this.set("yAxisRoom", 25);
    this.set("legendRoom", 90);

    this.set("legendRectSize", 18);
    this.set("legendSpacing", 4);

    var color = d3.scale.ordinal()
      .range(this.get("colorPalette"));

    var margin = this.get("margin")(
      this.get("xAxisRoom"),
      this.get("yAxisRoom"),
      this.get("legendRoom")
    );

    var plotWidth = this.get("chartDivWidth") - margin.left - margin.right,
        plotHeight = this.get("chartDivHeight") - margin.top - margin.bottom;

    // // TODO: put in route?
    // var self = this;
    // var data = this.get("data").processed.map(function(d) {
    //   d.date = self.get("formatDateKeen").parse(d.timeframe.start);
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
    //   //.ticks(n_days)
    //   .tickFormat(this.get("formatDateDisplay"))
    //   .tickSubdivide(0);

    // var yAxis = d3.svg.axis()
    //   .scale(y)
    //   .orient("left")
    //   .ticks(4)
    //   .tickFormat(this.get("formatCount"))
    //   .tickSubdivide(0);

    var svg = this.get("drawSvg")(this.get("chartElement"), plotWidth, plotHeight, margin);

    // _drawLine(data, x, y, svg, color());
    // this.get("drawXAxis")(xAxis, svg, plotHeight);
    // this.get("drawYAxis")(yAxis, svg, this.get("yAxisRoom"));
    // this.get("drawTitle")(this.get("titleString"), this.element);

  }
});
