/* global Keen */

import Ember from 'ember';
import HistogramMixin from '../mixins/histogram';
import config from '../config/environment';

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

    var fillArray = function(value, len) {
      var arr = [];
      for (var i = 0; i < len; i++) {
        arr.push(value);
      }
      return arr;
    };

    var melt = function(data, groupBy) {
      var melted = [];

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

    var processedModel = model.map(function(m) {
      var query = m[0],
          specs = m[1];
      return {
        raw: query.result,
        melted: melt(query, specs.queryParams.groupBy)
      };
    });

    controller.set("model", processedModel);

  }

});
