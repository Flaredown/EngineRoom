export default DS.ActiveModelAdapter.extend({
  namespace: "keen",
  query: function(store, type, query) {
    var url = type;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      jQuery.getJSON(url, query).then(function(data) {
        Ember.run(null, resolve, data);
      }, function(jqXHR) {
        jqXHR.then = null; // tame jQuery's ill mannered promises
        Ember.run(null, reject, jqXHR);
      });
    });
  },
  findRecord: function(store, type, id, snapshot) {
    var url = [type.modelName, id].join('/');

    return new Ember.RSVP.Promise(function(resolve, reject) {
      jQuery.getJSON(url).then(function(data) {
        Ember.run(null, resolve, data);
      }, function(jqXHR) {
        jqXHR.then = null; // tame jQuery's ill mannered promises
        Ember.run(null, reject, jqXHR);
      });
    });
  },
  findAll: function(store, type, sinceToken) {
    var url = type;
    var query = { since: sinceToken };
    return new Ember.RSVP.Promise(function(resolve, reject) {
      jQuery.getJSON(url, query).then(function(data) {
        Ember.run(null, resolve, data);
      }, function(jqXHR) {
        jqXHR.then = null; // tame jQuery's ill mannered promises
        Ember.run(null, reject, jqXHR);
      });
    });
  }
});
