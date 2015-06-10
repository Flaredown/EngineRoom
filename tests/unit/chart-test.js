/* global Ember, ok */

import { moduleFor, test } from "ember-qunit";
import ChartMixin from "../../mixins/chart";

moduleFor("mixin:chart", "ChartMixin");

// Replace this with your real tests.
test("it works", function() {
  var DummyObject = Ember.Object.extend(ChartMixin);
  var subject = DummyObject.create();
  
  ok(subject);
});
