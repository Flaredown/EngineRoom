import Ember from "ember";
import Chart from "../mixins/chart";
var computed = Em.computed;


export default Ember.Component.extend(Chart, {

  nDays: 4,  // TODO: unhardcode

  // data properties

  prcoessedData: computed("data", "timeframeStart", "timeframeEnd", function() {
    return this.filterByDate(
      this.get("data").raw,
      this.get("timeframeStart"),
      this.get("timeframeEnd")
    );
  }),

  // other properties

  chartDivWidth: computed("chartElement", function() {
    return parseInt(d3.select(this.get("chartElement")).style("width"), 10);
  }),

  chartElement: computed("elementId", function() {
    return "#" + this.get("elementId") + " .chart";
  }),

  colorScale: computed("colorPalette", function() {
    return d3.scale.ordinal().range(this.get("colorPalette"));
  }),

  lineFunction: computed("xScale", "yScale", function(){
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

  titleString: computed("data", "formatDateDisplay", "timeframeStart", "timeframeEnd", function() {
    var spec = this.get("data").specs;
    return spec.queryType +
      " " + spec.queryParams.targetProperty +
      " in " + spec.queryParams.eventCollection +
      " " + spec.queryParams.interval +
      " from " + this.get("formatDateDisplay")(this.get("timeframeStart")) +
      " to " + this.get("formatDateDisplay")(this.get("timeframeEnd")) ;
  }),

  xAxis: computed("formatDateDisplay", "nDays", "xScale", function() {
    return d3.svg.axis()
      .scale(this.get("xScale"))
      .orient("bottom")
      .ticks(this.get("nDays"))
      .tickFormat(this.get("formatDateDisplay"))
      .tickSubdivide(0);
  }),

  xScale: computed("paddingRight", "plotWidth", "prcoessedData", function() {
    return d3.time.scale()
      .domain(d3.extent(this.get("prcoessedData"), function(d) { return d.date; }))
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

  yScale: computed("paddingTop", "plotHeight", "prcoessedData", function() {
    return d3.scale.linear()
      .domain([0, d3.max(this.get("prcoessedData"), function(d) { return d.value; })])
      .range([this.get("plotHeight"), 0 + this.get("paddingTop")]);
  }),

  chartElements: function(){
    // this returns the update selection
    // note that data is wrapped in an array: this is to get joins to work with line graphs
    return this.get("svg").selectAll(".line").data([this.get("prcoessedData")]);    
  },

  chartEnter: function(){
    var updateSelection = this.get("svg").selectAll(".line")
      .data([this.get("prcoessedData")]);
    var enterSelection = updateSelection.enter();

    enterSelection.append("path")
      .attr("class", "line")
      .style("stroke", this.get("colorPalette"));

    updateSelection.attr("d", this.get("lineFunction"));
    
  },

  chartUpdate: function(){
    this.chartEnter();

    var updateSelection = this.chartElements();

    updateSelection.attr("d", this.get("lineFunction"))
      .attr("class", "line")
      .style("stroke", this.get("colorPalette")[0]);

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
