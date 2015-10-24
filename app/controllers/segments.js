import Ember from "ember";

var computed = Ember.computed;

export default Ember.Controller.extend({
    numConditions: computed('model', function() {
        return this.get('numConditions');
    }),
    numSymptoms: computed('model', function() {
        return this.get('numSymptoms');
    }),
    numTreatments: computed('model', function() {
        return this.get('numTreatments');
    })
});
