import Ember from "ember";
import Chart from "../mixins/chart";
var computed = Em.computed;


function pointIsInArc(pt, ptData, d3Arc) {
  // source: http://stackoverflow.com/a/19801529
  // Center of the arc is assumed to be 0,0
  // (pt.x, pt.y) are assumed to be relative to the center
  var r1 = d3Arc.innerRadius()(ptData),
      r2 = d3Arc.outerRadius()(ptData),
      theta1 = d3Arc.startAngle()(ptData),
      theta2 = d3Arc.endAngle()(ptData);
  
  var dist = pt.x * pt.x + pt.y * pt.y,
      angle = Math.atan2(pt.x, -pt.y);
  
  angle = (angle < 0) ? (angle + Math.PI * 2) : angle;
      
  return (r1 * r1 <= dist) && (dist <= r2 * r2) && 
         (theta1 <= angle) && (angle <= theta2);
}


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

    // will it come back to bite us if we do the filtering here and not in groupedData?
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

  total: computed("groupedData", function() {
    return this.get("groupedData")
      .map((x) => { return x.value; })
      .reduce((previousValue, currentValue) => { return previousValue + currentValue; });
  }),

  chartElements: function() {
    // this returns the update selection
    return this.get("svg").selectAll("g.group").data(this.get("pieData"));
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

    var enterSelection = this.get("svg").selectAll("g.group")
      .data(this.get("pieData"))
      .enter();

    var groups = enterSelection.append("g")
      .attr("class", "group");

    groups.append("path")
      .attr("d", this.get("arcFunction"))
      .style("fill", (d) => { return this.get("colorScale")(d.data.groupBy); });

    var arcFunction = this.get("arcFunction"); // needed for text function

    groups.append("text")
      .attr("transform", (d) => {
        return "translate(" + this.get("arcFunction").centroid(d) + ")";
      })
      .attr("dy", ".35em")
      .attr("class", "graph-label")
      .text((d) => { return this.formatPercentage(d.data.value, this.get("total")); })
        .each(function(d) {

          var bb = this.getBBox(),  // can't use a fat-arrow function because then this != text
              center = arcFunction.centroid(d);  
               
          var topLeft = {
            x : center[0] + bb.x,
            y : center[1] + bb.y
          };  
          var topRight = {
            x : topLeft.x + bb.width,
            y : topLeft.y
          };
          var bottomLeft = {
            x : topLeft.x,
            y : topLeft.y + bb.height
          };
          var bottomRight = {
            x : topLeft.x + bb.width,
            y : topLeft.y + bb.height
          };
           
          d.visible = pointIsInArc(topLeft, d, arcFunction) &&
                      pointIsInArc(topRight, d, arcFunction) &&
                      pointIsInArc(bottomLeft, d, arcFunction) &&
                      pointIsInArc(bottomRight, d, arcFunction);
      })
        .style("display", (d) => { return d.visible ? null : "none"; });

    this.legendEnter();
  },

  chartUpdate: function(){
    this.chartEnter();

    var updateSelection = this.chartElements();

    updateSelection.selectAll("path")
      .attr("d", this.get("arcFunction"))
      .style("fill", (d) => { return this.get("colorScale")(d.data.groupBy); });

    var arcFunction = this.get("arcFunction"); // needed for text function

    updateSelection.selectAll("text")
      .attr("transform", (d) => {
        return "translate(" + this.get("arcFunction").centroid(d) + ")";
      })
      .attr("dy", ".35em")
      .attr("class", "graph-label")
      .text((d) => { return this.formatPercentage(d.data.value, this.get("total")); })
      .style("display", "block")  // reset display temporarily so text.getBBox() gets bounding box
        .each(function(d) {

          var bb = this.getBBox(),  // can't use a fat-arrow function because then this != text
              center = arcFunction.centroid(d);  
               
          var topLeft = {
            x : center[0] + bb.x,
            y : center[1] + bb.y
          };  
          var topRight = {
            x : topLeft.x + bb.width,
            y : topLeft.y
          };
          var bottomLeft = {
            x : topLeft.x,
            y : topLeft.y + bb.height
          };
          var bottomRight = {
            x : topLeft.x + bb.width,
            y : topLeft.y + bb.height
          };
           
          d.visible = pointIsInArc(topLeft, d, arcFunction) &&
                      pointIsInArc(topRight, d, arcFunction) &&
                      pointIsInArc(bottomLeft, d, arcFunction) &&
                      pointIsInArc(bottomRight, d, arcFunction);
      })
        .style("display", (d) => { return d.visible ? null : "none"; });

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
