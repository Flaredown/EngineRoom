import Ember from "ember";
import DS from "ember-data";
var attr = DS.attr;
var Model = DS.Model;

export default Model.extend({
  chartType: attr("string")
  // TODO etc
});
