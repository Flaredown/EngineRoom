import Ember from "ember";
import Chart from "../mixins/chart";
var computed = Em.computed;


export default Ember.Component.extend(Chart, {

  legendRectSize: 18,
  legendSpacing: 4,
  xAxis: null,  // TODO: is this the right way to handle not needing axes?
  yAxis: null,

  arcFunction: computed("holeWidth", "radius", function() {
    return d3.svg.arc()
      .innerRadius(this.get("radius") - this.get("holeWidth"))
      .outerRadius(this.get("radius"));
  }),

  chartDivWidth: computed("chartElement", function() {
    return parseInt(d3.select(this.get("chartElement")).style("width"), 10);
  }),

  chartElement: computed("elementId", function() {
    return "#" + this.get("elementId") + " .chart";
  }),  

  colorScale: computed("colorPalette", "groups", function() {
    return d3.scale.ordinal()
      .domain(this.get("groups"))
      .range(this.get("colorPalette"));
  }),

  groupBy: computed("data", function() {
    return this.get("data").specs.queryParams.groupBy;
  }),

  groupedData: computed("data", "groups", function(){
    var _data = this.get("data").processed;
    return this.get("groups").map((name) => {
      return {
        groupBy: name,
        value: _data.map((d) => { return d.result; })[this.get("groups").indexOf(name)]
      };
    });
  }),

  groups: computed("data", "groupBy", function() {
    return this.get("data").processed.map((d) => {
      return d[this.get("groupBy")];
    });
  }),

  holeWidth: computed("radius", function() {
    return this.get("radius") / 2;
  }),

  pieData: computed("groupedData", function() {
    var pieFunction = d3.layout.pie()
      .value(function(d) { return d.value; })
      .sort(null);

    return pieFunction(
      this.get("groupedData")
        .filter((value) => { return value.groupBy !== null; })
    );
  }),

  pieFunction: computed(function() {
     return d3.layout.pie()
      .value(function(d) { return d.value; })
      .sort(null);   
  }),

  plotHeight: computed("chartDivHeight", "margin", function(){
    return this.get("chartDivHeight") - this.get("margin").top - this.get("margin").bottom;
  }),

  plotWidth: computed("chartDivWidth", "margin", function(){
    return this.get("chartDivWidth") - this.get("margin").left - this.get("margin").right;
  }),  

  radius: computed("plotHeight", "plotWidth", function(){
    return Math.min(this.get("plotWidth"), this.get("plotHeight")) / 2;
  }),

  titleString: computed("data", function() {
    var spec = this.get("data").specs;
    return spec.queryType +
      " " + spec.queryParams.targetProperty +
      " in " + spec.queryParams.eventCollection +
      " by " + spec.queryParams.groupBy;
  }),

  chartElements: function() {
    // this returns the update selection
    return this.get("svg").selectAll("path.group").data(this.get("pieData"));
  },

  chartEnter: function(){
    // svg > g needs a different translate value from that given in Chart
    // TODO refactor so that g is the responsibility of the individual chart type
    // ... and this.get("svg") returns an svg, not a g
    this.get("svg").attr(
      "transform",
      "translate(" +
        (this.get("margin").left + this.get("plotWidth") / 2) +
        ", " +
        (this.get("margin").top + this.get("plotHeight") / 2) +
        ")"
    );

    var enterSelection = this.get("svg").selectAll("path.group")
      .data(this.get("pieData"))
      .enter();

    enterSelection.append("path")
      .attr("class", "group")
      .attr("d", this.get("arcFunction"))
      .style("fill", (d) => { return this.get("colorScale")(d.data.groupBy); });

    this.legendEnter();
  },

  chartUpdate: function(){
    this.chartEnter();

    var updateSelection = this.chartElements();

    updateSelection.attr("d", this.get("arcFunction"))
      .style("fill", (d) => { return this.get("colorScale")(d.data.groupBy); });

    var exitSelection = updateSelection.exit();
    exitSelection.remove();

    this.legendUpdate();

  },

  legendElements: function() {
    // this returns the update selection
    return this.get("svg").selectAll(".legend").data(this.get("groupedData"));       
  },

  legendEnter: function() {

    var enterSelection = this.get("svg").selectAll(".legend")
      .data(this.get("groupedData"))
      .enter();

    var legendGs = enterSelection.append("g")
      .attr("class", "legend")
      .attr("transform", (d, i) => {
        var legendEntryHeight = this.get("legendRectSize") + this.get("legendSpacing");
        var offset = 0;
        var horz = this.get("plotWidth") + 10;
        var vert = i * legendEntryHeight - offset;
        return "translate(" + horz + "," + vert + ")";
      });

    legendGs.append("rect")
      .attr("width", this.get("legendRectSize"))
      .attr("height", this.get("legendRectSize"))
      .style("fill", (d) => { 
        return this.get("colorScale")(d.groupBy);
      })
      .style("stroke", (d) => { 
        return this.get("colorScale")(d.groupBy);
      });

    legendGs.append("text")
      .attr("x", this.get("legendRectSize") + this.get("legendSpacing"))
      .attr("y", this.get("legendRectSize") - this.get("legendSpacing"))
      .text(function(d) { return d.groupBy; })
      .call(
        this.truncate,
        this.get("legendRoom") - this.get("legendRectSize") - this.get("legendSpacing"),
        0
      );
  },

  legendUpdate: function() {

    var updateSelection = this.legendElements();

    updateSelection.attr("transform", (d, i) => {
        var legendEntryHeight = this.get("legendRectSize") + this.get("legendSpacing");
        var offset = legendEntryHeight * this.get("groups").length / 2;
        var horz = (this.get("plotWidth") / 2) + 10;
        var vert = i * legendEntryHeight - offset;
        return "translate(" + horz + "," + vert + ")";
      });

    updateSelection.selectAll("rect")
      .attr("width", this.get("legendRectSize"))
      .attr("height", this.get("legendRectSize"))
      .style("fill", (d) => { 
        return this.get("colorScale")(d.groupBy);
      })
      .style("stroke", (d) => { 
        return this.get("colorScale")(d.groupBy);
      });

    updateSelection.selectAll("text")
      .attr("x", this.get("legendRectSize") + this.get("legendSpacing"))
      .attr("y", this.get("legendRectSize") - this.get("legendSpacing"))
      .text(function(d) { return d.groupBy; })
      .call(
        this.truncate,
        this.get("legendRoom") - this.get("legendRectSize") - this.get("legendSpacing"),
        0
      );

    var exitSelection = updateSelection.exit();
    exitSelection.remove();        
  },  

  willInsertElement(){
    this.set("chartDivHeight", 250);
    this.set("xAxisRoom", 0);
    this.set("yAxisRoom", 0);
    this.set("legendRoom", 90);
  }

});
