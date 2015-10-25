import Ember from "ember";

import ComparisonFixture from "engine-room/models/comparison-fixture";

var computed = Em.computed;

export default Ember.Route.extend({
    model() {
        var model = {};

        // map array of objects to an object: { numConditions: {}, numSymptoms: {}}
        ComparisonFixture().forEach(function(obj) {
            var key = Object.keys(obj)[0];
            model[key] = obj[key];
        });

        return model;
    },
    setupController(controller, model) {
        controller.set("numConditions", model.n_conditions);
        controller.set("numSymptoms", model.n_symptoms);
        controller.set("numTreatments", model.n_treatments);
    }
});