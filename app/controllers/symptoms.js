import Ember from "ember";

var computed = Ember.computed;

export default Ember.Controller.extend({
  nSymptoms: computed("model", function() { return this.get("model")[0]; }),
  topSymptoms: computed("model", function() { return this.get("model")[1]; }),
  diffSymptoms: computed("model", function() { return this.get("model")[2]; })
});
