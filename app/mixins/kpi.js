import Ember from "ember";
var computed = Em.computed;

function zip(arrays) {
  return arrays[0].map(function(_, i) {
    return arrays.map(function(array) {
      return array[i];
    });
  });
}

export default Ember.Mixin.create({
  keenQuerying: Ember.inject.service(),

  constructQuery: function(metric) {
    Ember.assert("must have config", Ember.isPresent(this.get("config")));

    metric.queryParams.timeframe = this.get("config").filters.baseTimeframe;

    var endDate = d3.time.format("%Y-%m-%dT%H:%M:%S.%LZ")(new Date());  // format Time.now for keen
    metric.queryParams.timeframe.end = endDate;

    Ember.assert("must supply timeframe end", Ember.isPresent(metric.queryParams.timeframe.end));
    return new Keen.Query(metric.queryType, metric.queryParams);
  },

  model() {
    Ember.assert("must have config", Ember.isPresent(this.get("config")));

    var keenQueries = this.get("config").metrics.map((metric) => {
      return this.constructQuery(metric);
    });

    return new Ember.RSVP.Promise((resolve, reject) => {
      this.get("keenQuerying.client").run(keenQueries, (err, res) => {
        if (err) {
          reject(err);
        }
        else {
          resolve(res);
        }
      });
    }).then((response) => {
      return zip([response, this.get("config").metrics]);
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