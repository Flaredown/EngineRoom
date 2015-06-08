import Ember from "ember"

var computed = Ember.computed;

export default Ember.Controller.extend({
  // lots of histograms
  histoOne: computed("model", function () { return this.get("model.firstObject"); }),
  histoTwo: computed("model", function () { return this.get("model.lastObject"); })
});