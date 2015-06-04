import Ember from 'ember';
import HistogramMixin from '../mixins/histogram';

export default Ember.Route.extend(HistogramMixin, {

  keenQuerying: Ember.inject.service(),

  model() {
    // multiQuery exists too
    // https://github.com/plyfe/ember-keen-querying

    var keenData = this.get("keenQuerying").query("count", {
        eventCollection: "pageviews"
      }
    ).then(function(response) {
        console.log(response.result);
      }
    );

    console.log(this.get("d3DataWrangle")(99));

    // Some histo-data
    return [[1],[2],[2],[3],[3],[3],[4],[4],[5]];
  },

  afterModel(model) {
    // tweak stuff here!
  }

});
