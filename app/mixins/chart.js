import Ember from "ember";

var DISPLAY_DATE_FORMAT = "%b %d";
var FLAREDOWN_COLORS = [
  "#B2BE84", "#709CB2", "#ED9E81",
  "#E7CC89", "#B18DB4", "#74A893",
  "#DB7B9C", "#F07670"
];
var KEEN_DATE_FORMAT = "%Y-%m-%dT%H:%M:%S.%LZ";
var MARGIN_BASE = 12;
var PADDING_TOP = 0;
var PADDING_RIGHT = 10;

function truncate(text, width, padding) {
  text.each(function() {
    var self = d3.select(this),
      textLength = self.node().getComputedTextLength(),
      text = self.text();
    while (textLength > (width - 2 * padding) && text.length > 0) {
      text = text.slice(0, -1);
      self.text(text + '...');
      textLength = self.node().getComputedTextLength();
    }
  });
}


export default Ember.Mixin.create({

  colorPalette: FLAREDOWN_COLORS,
  formatCount: d3.format("d"),
  formatDateDisplay: d3.time.format(DISPLAY_DATE_FORMAT),
  formatDateKeen: d3.time.format(KEEN_DATE_FORMAT),
  paddingRight: PADDING_RIGHT,
  paddingTop: PADDING_TOP,

  drawSvg: function(element, width, height, margin) {
    // violates command-query separation by having side effects and returning value

    return d3.select(element).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");  
  },

  drawTitle: function(titleString, element) {
    d3.select(element).select(".chart-title").text(titleString);
  },

  drawXAxis: function(axis, target, height) {
    target.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0, " + height + ")")
      .call(axis);
  },

  drawYAxis: function(axis, target, yAxisRoom) {
    target.append("g")
      .attr("class", "y axis")
      .call(axis)
    .selectAll(".tick text")
      .call(truncate, yAxisRoom, 0);
    // .append("svg:title")
    //   .text(function(d) { return d; });
  },

  margin: function(xAxisRoom, yAxisRoom, legendRoom) {
    return {
      top: MARGIN_BASE,
      right: MARGIN_BASE + legendRoom,
      bottom: MARGIN_BASE + xAxisRoom,
      left: MARGIN_BASE + yAxisRoom
    };
  }
});
