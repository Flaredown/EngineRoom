import Ember from "ember";

var computed = Ember.computed;

export default Ember.Controller.extend({
  // lots of histograms
  histoOne: computed("model", function() { return this.get("model")[0]; }),
  histoTwo: computed("model", function() { return this.get("model")[1]; }),
  lineOne: computed("model", function() { return this.get("model")[2]; })
});
