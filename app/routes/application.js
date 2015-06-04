import Ember from 'ember';

export default Ember.Route.extend({
  keenQuerying: Ember.inject.service(),

  model() {
    // multiQuery exists too
    // https://github.com/plyfe/ember-keen-querying
    return this.get("keenQuerying").query("count","pageviews");
  },

  afterModel(model) {
    // tweak stuff here!
  }


});