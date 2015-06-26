import Ember from "ember";
import Chart from "../mixins/chart";
var computed = Em.computed;

function sortValues(groupedData) {
  return groupedData.sort(
    function (a, b) {
      if (a.value > b.value) {
        return -1;
      }
      if (a.value < b.value) {
        return 1;
      }
      // a must be equal to b
      return 0;
    });
}


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

  // TODO: should this go in route?
  finalData: computed("data", "groupBy", "maxBars", "timeframeStart", "timeframeEnd", function() {

    var _data = this.filterByDate(
      this.get("data").processed,
      this.get("timeframeStart"),
      this.get("timeframeEnd")
    );

    var _groupedData = _data[0].value.map((col, i) => { 
      return {
        value: _data.map((row) => {
            return row.value[i].result;
          })
          .reduce((previousValue, currentValue) => {
            return previousValue + currentValue;
          }),
        groupBy: col[this.get("groupBy")]
      };
    });

    return sortValues(_groupedData)
      .filter((d) => { return d.groupBy !== null; })
      .slice(0, this.get("maxBars"));    
  }),
  
  groupBy: computed("data", function() {
    return this.get("data").specs.queryParams.groupBy;
  }),

  groups: computed("data", "groupBy", function() {
    return this.get("data").processed[0].value.map((x) => {
      return x[this.get("groupBy")];
    });
  }),

  plotHeight: computed("chartDivHeight", "margin", function() {
    return this.get("chartDivHeight") - this.get("margin").top - this.get("margin").bottom;
  }),

  plotWidth: computed("chartDivWidth", "margin", function() {
    return this.get("chartDivWidth") - this.get("margin").left - this.get("margin").right;
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

  xScale: computed("finalData", "plotWidth", function(){
    return d3.scale.linear()
      .domain([0, d3.max(this.get("finalData"), (d) => { return d.value; })])
      .range([0, this.get("plotWidth")]);
  }),

  yAxis: computed("yScale", "finalData", function(){
    return d3.svg.axis()
      .scale(this.get("yScale"))
      .orient("left")
      .ticks(this.get("finalData").length);
  }),

  yScale: computed("groupBy", "finalData", "plotHeight", function(){
    return d3.scale.ordinal()
      .domain(this.get("finalData").map((d) => { return d.groupBy; }))
      .rangeRoundBands([0, this.get("plotHeight")], 0.1);    
  }),

  chartElements: function() {
    // this returns the update selection
    return this.get("svg").selectAll(".bar").data(this.get("finalData"));
  },

  chartEnter: function() {
    var enterSelection = this.get("svg").selectAll("rect.bar")
      .data(this.get("finalData"))
      .enter();

    enterSelection.append("rect")
      .attr("class", "bar")
      .style("fill", (d, i) => { return this.get("colorScale")(i); })
      .attr("transform", (d) => {
        return "translate(0, " + this.get("yScale")(d.groupBy) + ")";
      })
      .attr("x", 1)
      .attr("width", (d) => { return this.get("xScale")(d.value); })
      .attr("height", this.get("yScale").rangeBand);
  },

  chartUpdate: function() {
    this.chartEnter();

    var updateSelection = this.chartElements();

    updateSelection.style("fill", (d, i) => { return this.get("colorScale")(i); })
      .attr("transform", (d) => {
        return "translate(0, " + this.get("yScale")(d.groupBy) + ")";
      })
      .attr("x", 1)
      .attr("width", (d) => { return this.get("xScale")(d.value); })
      .attr("height", this.get("yScale").rangeBand);

    var exitSelection = updateSelection.exit();
    exitSelection.remove();        
  },

  willInsertElement(){
    this.set("chartDivHeight", 250);
    this.set("xAxisRoom", 13);
    this.set("yAxisRoom", 78);
    this.set("legendRoom", 0);
  }
});
