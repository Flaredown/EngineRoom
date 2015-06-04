import Ember from 'ember';

export default Ember.Route.extend({
  keenQuerying: Ember.inject.service(),

  model() {
    // multiQuery exists too
    // https://github.com/plyfe/ember-keen-querying
    // return this.get("keenQuerying").query("count","pageviews");

    // Some histo-data
    return [[1],[2],[2],[3],[3],[3],[4],[4],[5]];
  },

  afterModel(model) {
    // tweak stuff here!
  }


});