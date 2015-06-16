import Ember from "ember";

var computed = Ember.computed;

export default Ember.Controller.extend({
  histoOne: computed("model", function() { return this.get("model")[0]; }),
  lineOne: computed("model", function() { return this.get("model")[1]; }),
  barOne: computed("model", function() { return this.get("model")[2]; }),
  stackedAreaOne: computed("model", function() { return this.get("model")[3]; })
});
