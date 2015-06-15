import Ember from "ember";
import Chart from "../mixins/chart";
var computed = Em.computed;

function _chartDivWidth(element) {
  return parseInt((element).style("width"), 10);
}

function _drawBars(data, xScale, yScale, target, height, colorScale) {

  var bar = target.selectAll(".bar")
      .data(data)
      .enter()
    .append("g")
      .attr("class", "bar")
      .style("fill", function(d) { return colorScale(d[0]); })
      .attr("transform", function(d) {
        return "translate(" + xScale(d.x) + ", " + yScale(d.y) + ")";
      });

  bar.append("rect")
      .attr("x", 1)
      .attr("width", function(d) { return xScale(d.dx) - 1; })
      .attr("height", function(d) { return height - yScale(d.y); });

}

function _drawXAxis(axis, target, height) {
  target.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0, " + height + ")")
    .call(axis);
}

function _drawYAxis(axis, target) {
  target.append("g")
    .attr("class", "y axis")
    .call(axis);
}

function _nBins(maxValue, width) {
  return Math.min(maxValue + 1, width / 20);
}

export default Ember.Component.extend(Chart, {

  titleString: computed("data", function() {
  var spec = this.get("data").specs;
  return spec.queryType +
    " " + spec.queryParams.targetProperty +
    " in " + spec.queryParams.eventCollection +
    " by " + spec.queryParams.groupBy;
  }),

  chartElement: computed("elementId", function() {
    return "#" + this.get("elementId") + " .chart";
  }),

  didInsertElement(){

    this.set("chartDivWidth",
      _chartDivWidth(d3.select(this.get("chartElement")))
    );
    this.set("chartDivHeight", 250);
    this.set("xAxisRoom", 13);
    this.set("yAxisRoom", 20);

    var color = d3.scale.ordinal()
      .range(this.get("colorPalette"));
    
    var maxValue = Math.max.apply(null, this.get("data").processed);

    var margin = this.get("margin")(
      this.get("xAxisRoom"),
      this.get("yAxisRoom")
    );

    var plotWidth = this.get("chartDivWidth") - margin.left - margin.right,
        plotHeight = this.get("chartDivHeight") - margin.top - margin.bottom;

    var nBins = _nBins(maxValue, plotWidth);

    var x = d3.scale.linear()
        .domain([0, maxValue + 1])
        .range([0, plotWidth - this.get("paddingRight")]);

    var data = d3.layout.histogram()
        .bins(x.ticks(nBins))
        (this.get("data").processed);

    var y = d3.scale.linear()
        .domain([0, d3.max(data, function(d) { return d.y; })])
        .range([plotHeight, 0 + this.get("paddingTop")]);

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

    var svg = this.get("drawSvg")(this.get("chartElement"), plotWidth, plotHeight, margin);
    _drawBars(data, x, y, svg, plotHeight, color);
    this.get("drawXAxis")(xAxis, svg, plotHeight);
    this.get("drawYAxis")(yAxis, svg);
    this.get("drawTitle")(this.get("titleString"), this.element);

  }

});