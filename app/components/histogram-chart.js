import Ember from "ember";
import Chart from "../mixins/chart";
var computed = Em.computed;

// TODO change all this.get("function") where it's not a computed property to this.function (in other files)

export default Ember.Component.extend(Chart, {

  binnedData: computed("data", "nBins", "xScale", function() {
    return d3.layout.histogram()
      .bins(this.get("xScale").ticks(this.get("nBins")))
      (this.get("data.processed"));
  }),

  // TODO make this a for real computed property -- propertyDidChange("chartDivWidth")
  chartDivWidth: computed("chartElement", function() {
    return parseInt(d3.select(this.get("chartElement")).style("width"), 10);
  }),

  chartElement: computed("elementId", function() {
    return "#" + this.get("elementId") + " .chart";
  }),

  colorScale: computed("colorPalette", function() {
    return d3.scale.ordinal().range(this.get("colorPalette"));
  }),

  maxValue: computed("data", function() {
    return Math.max.apply(null, this.get("data").processed);
  }),

  nBins: computed("maxValue", "plotWidth", function() {
    return Math.min(this.get("maxValue") + 1, this.get("plotWidth") / 20);
  }),

  plotWidth: computed("chartDivWidth", "margin", function(){
    return this.get("chartDivWidth") - this.get("margin").left - this.get("margin").right;
  }),

  plotHeight: computed("chartDivHeight", "margin", function(){
    return this.get("chartDivHeight") - this.get("margin").top - this.get("margin").bottom;
  }),

  titleString: computed("data", function() {
    var spec = this.get("data").specs;
    return spec.queryType +
      " " + spec.queryParams.targetProperty +
      " in " + spec.queryParams.eventCollection +
      " by " + spec.queryParams.groupBy;
  }),

  xAxis: computed("nBins", "xScale", function() {
    return d3.svg.axis()
      .scale(this.get("xScale"))
      .orient("bottom")
      .ticks(this.get("nBins"));
  }),

  xScale: computed("maxValue", "paddingRight", "plotWidth", function() {
    return d3.scale.linear()
      .domain([0, this.get("maxValue") + 1])
      .range([0, this.get("plotWidth") - this.get("paddingRight")]);
  }),

  yAxis: computed("formatCount", "yScale", function(){
    return d3.svg.axis()
      .scale(this.get("yScale"))
      .orient("left")
      .ticks(4)
      .tickFormat(this.get("formatCount"))
      .tickSubdivide(0);  
  }),

  yScale: computed("binnedData", "paddingTop", "plotHeight", function() {
    return d3.scale.linear()
      .domain([0, d3.max(this.get("binnedData"), function(d) { return d.y; })])
      .range([this.get("plotHeight"), 0 + this.get("paddingTop")]);
  }),

  chartElements: function() {
    // this returns the update selection
    return this.get("svg").selectAll(".bar").data(this.get("binnedData"));
  },

  chartEnter: function() {
    var enterSelection = this.get("svg").selectAll("rect.bar")
      .data(this.get("binnedData"))
      .enter();

    enterSelection.append("rect")
        .attr("class", "bar")
        .style("fill", (d) => { return this.get("colorScale")(d[0]); })
        .attr("transform", (d) => {
          return "translate(" + this.get("xScale")(d.x) + ", " + this.get("yScale")(d.y) + ")";
        })
        .attr("x", 1)
        .attr("width", (d) => { return this.get("xScale")(d.dx) - 1; })
        .attr("height", (d) => { return this.get("plotHeight") - this.get("yScale")(d.y); });
  },

  chartUpdate: function() {
    this.chartEnter();

    var updateSelection = this.chartElements();

    updateSelection.style("fill", (d) => { return this.get("colorScale")(d[0]); })
      .attr("transform", (d) => {
        return "translate(" + this.get("xScale")(d.x) + ", " + this.get("yScale")(d.y) + ")";
      })
      .attr("x", 1)
      .attr("width", (d) => { return this.get("xScale")(d.dx) - 1; })
      .attr("height", (d) => { return this.get("plotHeight") - this.get("yScale")(d.y); });

    var exitSelection = updateSelection.exit();
    exitSelection.remove();
  },

  willInsertElement(){
    this.set("chartDivHeight", 250);
    this.set("xAxisRoom", 13);
    this.set("yAxisRoom", 20);
    this.set("legendRoom", 0);
  }

});