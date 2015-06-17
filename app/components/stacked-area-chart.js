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

  chartDivWidth: computed("chartElement", function() {
    return parseInt(d3.select(this.get("chartElement")).style("width"), 10);
  }),

  chartElement: computed("elementId", function() {
    return "#" + this.get("elementId") + " .chart";
  }),

  groupBy: computed("data", function() {
    return this.get("data").specs.queryParams.groupBy;
  }),

  titleString: computed("data", function() {
  var spec = this.get("data").specs;
  return spec.queryType +
    " " + spec.queryParams.targetProperty +
    " in " + spec.queryParams.eventCollection +
    " by " + spec.queryParams.groupBy +
    " " + spec.queryParams.interval +
    " over " + spec.queryParams.timeframe;
  }),

  didInsertElement(){

    this.set("chartDivHeight", 250);
    this.set("xAxisRoom", 13);
    this.set("yAxisRoom", 25);
    this.set("legendRoom", 90);

    this.set("legendRectSize", 18);
    this.set("legendSpacing", 4);

    var color = d3.scale.ordinal()
      .range(this.get("colorPalette"));

    var margin = this.get("margin")(
      this.get("xAxisRoom"),
      this.get("yAxisRoom"),
      this.get("legendRoom")
    );

    var plotWidth = this.get("chartDivWidth") - margin.left - margin.right,
        plotHeight = this.get("chartDivHeight") - margin.top - margin.bottom;

    var data = this.get("data").processed;

    var groupBy = this.get("groupBy");

    var groups = data[0].value.map(function(x) {
      return x[groupBy];
    });

    color.domain(groups);

    // TODO put in route?
    var self = this;
    data.forEach(function(d) {
      d.date = self.get("formatDateKeen").parse(d.timeframe.start);
      d.total = d.value
        .map(function(x) { return x.result; })
        .reduce(function(previousValue, currentValue, index, array) {
          return previousValue + currentValue;
        });
    });

    // var stack = d3.layout.stack()
    //   .values(function(d) { return d.values; });

    // var grouped = stack(color.domain().map(function(name) {
    //   return {
    //     groupBy: name,
    //     values: data.map(function(d) {
    //       return {date: d.date, y: d.value[groups.indexOf(name)].result};
    //     })
    //   };
    // }));

    var x = d3.time.scale()
      .domain(d3.extent(data, function(d) { return d.date; }))
      .range([0, plotWidth]);

    var y = d3.scale.linear()
      .domain([0, d3.max(data, function(d) { return d.total; })])
      .range([plotHeight, 0]);

    // var area = d3.svg.area()
    //   .x(function(d) { return x(d.date); })
    //   .y0(function(d) { return y(d.y0); })
    //   .y1(function(d) { return y(d.y0 + d.y); });

    var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      //.ticks(n_days)
      .tickFormat(this.get("formatDateDisplay"))
      .tickSubdivide(0);

    var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .ticks(4)
      .tickFormat(this.get("formatCount"))
      .tickSubdivide(0);

    var svg = this.get("drawSvg")(this.get("chartElement"), plotWidth, plotHeight, margin);

    // var group = svg.selectAll(".group")
    //   .data(grouped)
    // .enter().append("g")
    //   .attr("class", "group");

    // group.append("path")
    //   .attr("class", "area")
    //   .attr("d", function(d) { return area(d.values); })
    //   .style("fill", function(d) { return color(d.groupBy); });

    this.get("drawXAxis")(xAxis, svg, plotHeight);
    this.get("drawYAxis")(yAxis, svg, this.get("yAxisRoom"));
    this.get("drawTitle")(this.get("titleString"), this.element);

    // var legend = svg.selectAll('.legend')
    //   .data(grouped)
    //   .enter()
    //   .append('g')
    //   .attr('class', 'legend')
    //   .attr('transform', function(d, i) {
    //     var legendEntryHeight = legendRectSize + legendSpacing;
    //     //var offset = legendEntryHeight * groups.length
    //     var offset = 0;
    //     var horz = width + 10;
    //     var vert = i * legendEntryHeight - offset;
    //     return 'translate(' + horz + ',' + vert + ')';
    //   });

    // legend.append('rect')
    //   .attr('width', legendRectSize)
    //   .attr('height', legendRectSize)
    //   .style('fill', function(d) { 
    //     return color(d.groupBy);
    //   })
    //   .style('stroke', function(d) { 
    //     return color(d.groupBy);
    //   });

    // legend.append('text')
    //   .attr('x', legendRectSize + legendSpacing)
    //   .attr('y', legendRectSize - legendSpacing)
    //   .text(function(d) { return d.groupBy; });

    // legend.selectAll('text')
    //   .call(truncate, legendRoom - legendRectSize - legendSpacing, 0)
    // .append("svg:title")
    //   .text(function(d) { return d.groupBy; });

  }
});
