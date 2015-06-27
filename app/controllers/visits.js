import Ember from "ember";

var computed = Ember.computed;

export default Ember.Controller.extend({
  visitsByBrowser: computed("model", function() { return this.get("model")[0]; }),
  browserShare: computed("model", function() { return this.get("model")[1]; }),
  osShare: computed("model", function() { return this.get("model")[2]; }),
  visitsByCountry: computed("model", function() { return this.get("model")[3]; })
});
