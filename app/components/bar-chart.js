import Ember from "ember";
import Chart from "../mixins/chart";
var computed = Em.computed;


export default Ember.Component.extend(Chart, {

  maxBars: 12,

  chartDivWidth: computed("chartElement", function() {
    return parseInt(d3.select(this.get("chartElement")).style("width"), 10);
  }),

  chartElement: computed("elementId", function() {
    return "#" + this.get("elementId") + " .chart";
  }),

  colorScale: computed("colorPalette", function() {
    return d3.scale.ordinal().range(this.get("colorPalette"));
  }),

  groupBy: computed("data", function() {
    return this.get("data").specs.queryParams.groupBy;
  }),

  plotHeight: computed("chartDivHeight", "margin", function(){
    return this.get("chartDivHeight") - this.get("margin").top - this.get("margin").bottom;
  }),

  plotWidth: computed("chartDivWidth", "margin", function(){
    return this.get("chartDivWidth") - this.get("margin").left - this.get("margin").right;
  }),

  sortedData: computed("data", "groupBy", "maxBars", function(){
    // TODO: should this go in route?
    return this.get("data").processed.sort(
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
        .filter((value) => { return value[this.get("groupBy")] !== null; })
        .slice(0, this.get("maxBars"));    
  }),

  titleString: computed("data", function() {
    var spec = this.get("data").specs;
    return spec.queryType +
      " " + spec.queryParams.targetProperty +
      " in " + spec.queryParams.eventCollection +
      " by " + spec.queryParams.groupBy;
  }),

  xAxis: computed("xScale", "formatCount", function(){
    return d3.svg.axis()
      .scale(this.get("xScale"))
      .orient("bottom")
      .ticks(4)
      .tickFormat(this.get("formatCount"))
      .tickSubdivide(0);
  }),

  xScale: computed("sortedData", "plotWidth", function(){
    return d3.scale.linear()
      .domain([0, d3.max(this.get("sortedData"), (d) => { return d.result; })])
      .range([0, this.get("plotWidth")]);
  }),

  yAxis: computed("yScale", "sortedData", function(){
    return d3.svg.axis()
      .scale(this.get("yScale"))
      .orient("left")
      .ticks(this.get("sortedData").length);
  }),

  yScale: computed("groupBy", "sortedData", "plotHeight", function(){
    return d3.scale.ordinal()
      .domain(this.get("sortedData").map((d) => { return d[this.get("groupBy")]; }))
      .rangeRoundBands([0, this.get("plotHeight")], 0.1);    
  }),

  chartElements: function() {
    // this returns the update selection
    return this.get("svg").selectAll(".bar").data(this.get("sortedData"));
  },

  chartEnter: function(){
    var enterSelection = this.get("svg").selectAll("rect.bar")
      .data(this.get("sortedData"))
      .enter();

    enterSelection.append("rect")
      .attr("class", "bar")
      .style("fill", (d, i) => { return this.get("colorScale")(i); })
      .attr("transform", (d) => {
        return "translate(0, " + this.get("yScale")(d[this.get("groupBy")]) + ")";
      })
      .attr("x", 1)
      .attr("width", (d) => { return this.get("xScale")(d.result); })
      .attr("height", this.get("yScale").rangeBand);
  },

  chartUpdate: function(){
    this.chartEnter();

    var updateSelection = this.chartElements();

    updateSelection.style("fill", (d, i) => { return this.get("colorScale")(i); })
      .attr("transform", (d) => {
        return "translate(0, " + this.get("yScale")(d[this.get("groupBy")]) + ")";
      })
      .attr("x", 1)
      .attr("width", (d) => { return this.get("xScale")(d.result); })
      .attr("height", this.get("yScale").rangeBand);

    var exitSelection = updateSelection.exit();
    exitSelection.remove();        
  },

  willInsertElement(){
    this.set("chartDivHeight", 250);
    this.set("xAxisRoom", 13);
    this.set("yAxisRoom", 78);
    this.set("legendRoom", 0);
  },
});
