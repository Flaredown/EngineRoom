import Ember from "ember";
import Chart from "../mixins/chart";
var computed = Em.computed;
var observer = Em.observer;

function _drawBars(data, xScale, yScale, target, height, colorScale) {
  console.log(target);
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

// TODO change all this.get("function") where it's not a computed property to this.function (in other files)

export default Ember.Component.extend(Chart, {
  D3IsSetUp: false,
  dataChanged: observer("data", function() {
    console.log(this.get("data"));
    // if (this.get("D3IsSetUp")) {
    //   this.drawD3Elements();
    // } else {
    //   Ember.run(() => { 
    //     this.setupD3();
    //     // this.drawD3Elements();
    //   });
    // }
    this.setupD3();
  }).on("didInsertElement"),

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

  nBins: computed("", function() {
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

  // TODO a lot of these params could become computed properties
  drawD3Elements: function() {
    _drawBars(this.get("binnedData"), this.get("xScale"), this.get("yScale"), this.get("svg"), this.get("plotHeight"), this.get("colorScale"));
    this.drawXAxis(this.get("xAxis"), this.get("svg"), this.get("plotHeight"));
    this.drawYAxis(this.get("yAxis"), this.get("svg"), this.get("yAxisRoom"));
    this.drawTitle(this.get("titleString"), this.get("element"));
  },

  setupD3: function() {
    this.didSetupD3();
    var svg = this.drawSvg(this.get("chartElement"), this.get("plotWidth"), this.get("plotHeight"), this.get("margin"));
    _drawBars(this.get("binnedData"), this.get("xScale"), this.get("yScale"), svg, this.get("plotHeight"), this.get("colorScale"));
    this.drawXAxis(this.get("xAxis"), svg, this.get("plotHeight"));
    this.drawYAxis(this.get("yAxis"), svg, this.get("yAxisRoom"));
    this.drawTitle(this.get("titleString"), this.get("element"));
    // Ember.run.scheduleOnce("afterRender", this, "didSetupD3");
    this.set("D3IsSetUp", true);
  },

  willInsertElement(){
    this.set("chartDivHeight", 250);
    this.set("xAxisRoom", 13);
    this.set("yAxisRoom", 20);
    this.set("legendRoom", 0);
  }

});