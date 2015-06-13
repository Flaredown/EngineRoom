import Ember from "ember";

var DISPLAY_DATE_FORMAT = "%b %d";
var FLAREDOWN_COLORS = [
  "#ECC916", "#F58A5A", "#D15423",
  "#D47C87", "#C01E55", "#DB9126",
  "#B83B8A", "#ED80B2", "#F27071",
  "#F7A8A8"
];
var KEEN_DATE_FORMAT = "%Y-%m-%dT%H:%M:%S.%LZ";
var MARGIN_BASE = 12;
var PADDING_TOP = 0;
var PADDING_RIGHT = 10;


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
        .attr("width", width + margin.left)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");  
  },

  margin: function(xAxisRoom, yAxisRoom) {
    return {
      top: MARGIN_BASE,
      right: MARGIN_BASE,
      bottom: MARGIN_BASE + xAxisRoom,
      left: MARGIN_BASE + yAxisRoom
    };
  }

});
