import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route("engagement", {path: "engagement"});
  this.route("visits", {path: "visits"});
});

export default Router;
