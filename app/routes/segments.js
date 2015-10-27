import Ember from "ember";

import ComparisonFixture from "engine-room/models/comparison-fixture";

var computed = Em.computed;

export default Ember.Route.extend({
    model() {
        // TODO client logic should determine if segmented data or not and be passed into the model. Also maybe the database
        // call to fetch the appropriate data would occur here.
        // Toggle isSegmented
        var isSegmented = true;
        var model = {};

        if (isSegmented) {
            // map array of objects to an object: { numConditions: {}, numSymptoms: {}}
            ComparisonFixture(true).forEach(function(obj) {
                var key = Object.keys(obj)[0];
                model[key] = obj[key];
            });
        } else {
            model = ComparisonFixture();
        }

        return model;
    },
    setupController(controller, model) {
        // Toggle isSegmented
        controller.set("isSegmented", true);
        controller.set("numConditions", model.n_conditions);
        controller.set("numSymptoms", model.n_symptoms);
        controller.set("numTreatments", model.n_treatments);
        controller.set("topConditions", model.top_conditions);
        controller.set("topSymptoms", model.top_symptoms);
        controller.set("topTreatments", model.top_treatments);
    }
});