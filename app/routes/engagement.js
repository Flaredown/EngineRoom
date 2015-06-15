import Ember from "ember";
import HistogramMixin from "../mixins/histogram";
import config from "../config/environment";

export default Ember.Route.extend(HistogramMixin, {

  keenQuerying: Ember.inject.service(),
  config: config.KPI.engagement,

  model() {

    var keenQueries = this.get("config").metrics.map(function(metric) {
      return new Keen.Query(metric.queryType, metric.queryParams);
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

    var self = this;

    var processedModel = model.map(function(m) {
      var query = m[0],
          specs = m[1];

      // TODO: case logic ripe for a refactor
      if (specs.chartType === "histogram"){
        var process = self.get("processHistogram");
        return {
          specs: specs,
          processed: process(query, specs.queryParams.groupBy)
        };
      } else if (specs.chartType === "line"){
        return {
          specs: specs,
          processed: query.result
        };
      } else if (specs.chartType === "bar"){
        return {
          specs: specs,
          processed: query.result
        };
      } else {
        throw "Unexpected chartType!";
      }
    });

    controller.set("model", processedModel);
  }

});
