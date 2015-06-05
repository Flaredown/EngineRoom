import Ember from 'ember';
import HistogramMixin from '../mixins/histogram';

export default Ember.Route.extend(HistogramMixin, {

  keenQuerying: Ember.inject.service(),

  model() {
    // multiQuery exists too
    // https://github.com/plyfe/ember-keen-querying

    var queryType = "count",
        eventCollection = "entries",
        targetProperty = "user_id",
        groupBy = "n_conditions";

    return this.get("keenQuerying").query(queryType, {
      eventCollection: eventCollection,
      targetProperty: targetProperty,
      groupBy: groupBy
    }).then(function(response) {
      return {
        query: response,
        groupBy: groupBy
      };
    });
  },

  setupController(controller, model) {

    var fillArray = function(value, len) {
      var arr = [];
      for (var i = 0; i < len; i++) {
        arr.push(value);
      }
      return arr;
    };

    var melt = function(data, groupBy) {
      var melted = [];
      // TODO: This should probably go in the route
      for (var i = data.result.length - 1; i >= 0; i--) {
        var x = data.result[i];
      
        if (x[groupBy] === null) {
          melted = melted.concat(fillArray(0, x.result));
        } else {
          melted = melted.concat(fillArray(x[groupBy], x.result));
        }
      }
      return melted;
    };

    controller.set("model", {
      raw: model.query.result,
      melted: melt(model.query, model.groupBy)
    });

  }

});
