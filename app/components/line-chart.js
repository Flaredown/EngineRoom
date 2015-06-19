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

  nDays: 21,  // TODO: unhardcode

  chartDivWidth: computed("chartElement", function() {
    return parseInt(d3.select(this.get("chartElement")).style("width"), 10);
  }),

  chartElement: computed("elementId", function() {
    return "#" + this.get("elementId") + " .chart";
  }),

  colorScale: computed("colorPalette", function() {
    return d3.scale.ordinal().range(this.get("colorPalette"));
  }),

  lineFunction: computed("", function(){
    return d3.svg.line()
      .x((d) => { return this.get("xScale")(d.date); })
      .y((d) => { return this.get("yScale")(d.value); });    
  }),

  plotWidth: computed("chartDivWidth", "margin", function() {
    return this.get("chartDivWidth") - this.get("margin").left - this.get("margin").right;
  }),

  plotHeight: computed("chartDivHeight", "margin", function() {
    return this.get("chartDivHeight") - this.get("margin").top - this.get("margin").bottom;
  }),

  timestampedData: computed("data", "formatDateKeen", function() {
    return this.get("data").processed.map((d) => {
      d.date = this.get("formatDateKeen").parse(d.timeframe.start);
      return d;
    });
  }), 

  titleString: computed("data", function() {
    var spec = this.get("data").specs;
    return spec.queryType +
      " " + spec.queryParams.targetProperty +
      " in " + spec.queryParams.eventCollection +
      " " + spec.queryParams.interval +
      " over " + spec.queryParams.timeframe;
  }),

  xAxis: computed("formatDateDisplay", "nDays", "xScale", function() {
    return d3.svg.axis()
      .scale(this.get("xScale"))
      .orient("bottom")
      .ticks(this.get("nDays"))
      .tickFormat(this.get("formatDateDisplay"))
      .tickSubdivide(0);
  }),

  xScale: computed("paddingRight", "plotWidth", "timestampedData", function() {
    return d3.time.scale()
      .domain(d3.extent(this.get("timestampedData"), function(d) { return d.date; }))
      .range([0, this.get("plotWidth") - this.get("paddingRight")]);
  }),

  yAxis: computed("formatCount", "yScale", function() {
    return d3.svg.axis()
      .scale(this.get("yScale"))
      .orient("left")
      .ticks(4)
      .tickFormat(this.get("formatCount"))
      .tickSubdivide(0);
  }),

  yScale: computed("paddingTop", "plotHeight", "timestampedData", function() {
    return d3.scale.linear()
      .domain([0, d3.max(this.get("timestampedData"), function(d) { return d.value; })])
      .range([this.get("plotHeight"), 0 + this.get("paddingTop")]);
  }),

  chartElements: function(){
    // this returns the update selection
    // note that data is wrapped in an array: this is to get joins to work with line graphs
    return this.get("svg").selectAll(".line").data([this.get("timestampedData")]);    
  },

  chartEnter: function(){
    var updateSelection = this.get("svg").selectAll(".line")
      .data([this.get("timestampedData")]);
    var enterSelection = updateSelection.enter();

    enterSelection.append("path")
      .attr("class", "line")
      .style("stroke", this.get("colorPalette"))
      .style("stroke-width", 2) // TODO handle in css?
      .style("fill", "none");

    updateSelection.attr("d", this.get("lineFunction"));
    
  },

  chartUpdate: function(){
    this.chartEnter();

    var updateSelection = this.chartElements();

    updateSelection.attr("d", this.get("lineFunction"))
      .attr("class", "line")
      .style("stroke", this.get("colorPalette")[0])
      .style("stroke-width", 2) // TODO handle in css?
      .style("fill", "none");

    var exitSelection = updateSelection.exit();
    exitSelection.remove(); 
  },

  willInsertElement(){
    this.set("chartDivHeight", 250);
    this.set("xAxisRoom", 13);
    this.set("yAxisRoom", 25);
    this.set("legendRoom", 0);
  },
});
