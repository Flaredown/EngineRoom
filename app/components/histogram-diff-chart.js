import Ember from "ember";
import Chart from "../mixins/chart";
var computed = Em.computed;

// TODO change all this.get("function") where it's not a computed property to this.function (in other files)

function fillArray(value, len) {
  var arr = [];
  for (var i = 0; i < len; i++) {
    arr.push(value);
  }
  return arr;
}

function melt(data) {
  var melted = [];

  for (var i = data.length - 1; i >= 0; i--) {
    var x = data[i];

    if (x.groupBy === null) {
      melted = melted.concat(fillArray(0, x.value));
    } else {
      melted = melted.concat(fillArray(x.groupBy, x.value));
    }
  }

  return melted;
}

export default Ember.Component.extend(Chart, {

  // data properties

  processedData: computed("data", "groupBy", "timeframeStart", "timeframeEnd", function() {

    var _data = this.filterByDate(
      this.get("data").raw,
      this.get("timeframeStart"),
      this.get("timeframeEnd")
    );

    var _groupedData = _data[0].value.map((col, i) => { 
      debugger;
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
    return _groupedData;

  }),

  dataForD3: computed("processedData", "nBins", "xScale", function() {
    return d3.layout.histogram()
      .bins(this.get("xScale").ticks(this.get("nBins")))
      (melt(this.get("processedData")));
  }),

  // other properties

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

  groupBy: computed("data", function() {
    return this.get("data").specs.queryParams.groupBy;
  }),

  maxValue: computed("processedData", function() {
    var _values = this.get("processedData")
      .map((d) => { return d.groupBy; });
    return Math.max.apply(null, _values);
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

  yScale: computed("dataForD3", "paddingTop", "plotHeight", function() {
    return d3.scale.linear()
      .domain([0, d3.max(this.get("dataForD3"), function(d) { return d.y; })])
      .range([this.get("plotHeight"), 0 + this.get("paddingTop")]);
  }),

  chartElements: function() {
    // this returns the update selection
    return this.get("svg").selectAll(".bar").data(this.get("dataForD3"));
  },

  chartEnter: function() {
    var enterSelection = this.get("svg").selectAll("rect.bar")
      .data(this.get("dataForD3"))
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