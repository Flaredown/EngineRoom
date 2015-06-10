import Ember from "ember";

var FLAREDOWN_COLORS = [
  "#ECC916", "#F58A5A", "#D15423",
  "#D47C87", "#C01E55", "#DB9126",
  "#B83B8A", "#ED80B2", "#F27071",
  "#F7A8A8"
];

export default Ember.Mixin.create({

  colorPalette: FLAREDOWN_COLORS

});
