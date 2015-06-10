/* global d3 */

import Ember from "ember";


var FLAREDOWN_COLORS = [
  "#ECC916", "#F58A5A", "#D15423",
  "#D47C87", "#C01E55", "#DB9126",
  "#B83B8A", "#ED80B2", "#F27071",
  "#F7A8A8"
];
var MARGIN_BASE = 12;
var PADDING_TOP = 0;
var PADDING_RIGHT = 10;


export default Ember.Mixin.create({

  colorPalette: FLAREDOWN_COLORS,
  formatCount: d3.format("d"),
  marginBase: MARGIN_BASE,
  paddingRight: PADDING_RIGHT,
  paddingTop: PADDING_TOP

});
