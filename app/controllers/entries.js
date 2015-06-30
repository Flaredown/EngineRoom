import Ember from "ember";

var computed = Ember.computed;

export default Ember.Controller.extend({
  dailyEntries: computed("model", function() { return this.get("model")[0]; }),
  entriesByHour: computed("model", function() { return this.get("model")[1]; }),
  entriesByDay: computed("model", function() { return this.get("model")[2]; }),
});
