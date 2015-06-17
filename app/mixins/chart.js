import Ember from "ember";
var computed = Em.computed;
var observer = Em.observer;

const DISPLAY_DATE_FORMAT = "%b %d";
const FLAREDOWN_COLORS = [
  "#B2BE84", "#709CB2", "#ED9E81",
  "#E7CC89", "#B18DB4", "#74A893",
  "#DB7B9C", "#F07670"
];
const KEEN_DATE_FORMAT = "%Y-%m-%dT%H:%M:%S.%LZ";
const MARGIN_BASE = 12;
const PADDING_TOP = 0;
const PADDING_RIGHT = 10;

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

  propertiesOk: observer(function() {
    Ember.assert("must have chartDivHeight", Ember.isPresent(this.get("chartDivHeight")));
    Ember.assert("must have xAxisRoom", Ember.isPresent(this.get("xAxisRoom")));
    Ember.assert("must have yAxisRoom", Ember.isPresent(this.get("yAxisRoom")));
    Ember.assert("must have legendRoom", Ember.isPresent(this.get("legendRoom")));
  }).on("didInsertElement"),

  colorPalette: FLAREDOWN_COLORS,
  formatCount: d3.format("d"),
  formatDateDisplay: d3.time.format(DISPLAY_DATE_FORMAT),
  formatDateKeen: d3.time.format(KEEN_DATE_FORMAT),
  paddingRight: PADDING_RIGHT,
  paddingTop: PADDING_TOP,

  margin: computed("xAxisRoom", "yAxisRoom", "legendRoom", function() {
    return {
      top: MARGIN_BASE,
      right: MARGIN_BASE + this.get("legendRoom"),
      bottom: MARGIN_BASE + this.get("xAxisRoom"),
      left: MARGIN_BASE + this.get("yAxisRoom")
    };
  }),

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
  }

});
