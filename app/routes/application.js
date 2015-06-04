import Ember from 'ember';
import HistogramMixin from '../mixins/histogram';

export default Ember.Route.extend(HistogramMixin, {

  keenQuerying: Ember.inject.service(),

  model() {
    // multiQuery exists too
    // https://github.com/plyfe/ember-keen-querying

    return this.get("keenQuerying").query("count", {
      eventCollection: "entries",
      targetProperty: "user_id",
      groupBy: "n_conditions"
    });

    // Some histo-data
    // return [[1],[2],[2],[3],[3],[3],[4],[4],[5]];
  },

  afterModel(model) {

    var fillArray = function(value, len) {
      var arr = [];
      for (var i = 0; i < len; i++) {
        arr.push(value);
      }
      return arr;
    };

    var values = [];

    for (var i = model.result.length - 1; i >= 0; i--) {
      var x = model.result[i];
      
      if (x["n_conditions"] === null) {
        values = values.concat(fillArray(0, x.result));
      } else {
        values = values.concat(fillArray(x["n_conditions"], x.result));
      }
    }
  }

});
