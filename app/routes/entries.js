import Ember from "ember";
import config from "../config/environment";

export default Ember.Route.extend({

  keenQuerying: Ember.inject.service(),
  config: config.KPI.entries,

  constructQuery: function(metric) {
    metric.queryParams.timeframe = this.get("config").filters.baseTimeframe;

    var endDate = d3.time.format("%Y-%m-%dT%H:%M:%S.%LZ")(new Date());  // format Time.now for keen
    metric.queryParams.timeframe.end = endDate;

    Ember.assert("must supply timeframe end", Ember.isPresent(metric.queryParams.timeframe.end));
    return new Keen.Query(metric.queryType, metric.queryParams);
  },

  model() {

    var keenQueries = this.get("config").metrics.map((metric) => {
      return this.constructQuery(metric);
    });

    var zip = function(arrays) {
      return arrays[0].map(function(_, i) {
        return arrays.map(function(array) {
          return array[i];
        });
      });
    };

    var self = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      self.get("keenQuerying.client").run(keenQueries, function(err, res) {
        if (err) {
          reject(err);
        }
        else {
          resolve(res);
        }
      });
    }).then(function(response) {
      return zip([response, self.get("config").metrics]);
    });
  },

  setupController(controller, model) {

    var processedModel = model.map(function(m) {
      var query = m[0],
          specs = m[1];

      return {
        specs: specs,
        raw: query.result
      };
    });
    
    controller.set("model", processedModel);
  }
});
