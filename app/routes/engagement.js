import Ember from "ember";
import HistogramMixin from "../mixins/histogram";
import config from "../config/environment";

export default Ember.Route.extend(HistogramMixin, {

  keenQuerying: Ember.inject.service(),
  config: config.KPI.engagement,

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

    var self = this;

    var processedModel = model.map(function(m) {
      var query = m[0],
          specs = m[1];

      // TODO: case logic ripe for a refactor
      switch (specs.chartType) {
        case "histogram":
          var process = self.get("processHistogram");
          return {
            specs: specs,
            processed: process(query, specs.queryParams.groupBy)
          };
        case "line":
          return {
            specs: specs,
            processed: query.result
          };
        case "bar":
          return {
            specs: specs,
            processed: query.result
          };
        case "stackedArea":
          return {
            specs: specs,
            processed: query.result
          };
        case "ring":
          return {
            specs: specs,
            processed: query.result
          };          
        default:
          throw "Unexpected chartType!";
      }
    });
    
    controller.set("model", processedModel);
  }
});
