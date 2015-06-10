import { moduleFor, test } from "ember-qunit";
import ChartMixin from "../../mixins/chart";

moduleFor("mixin:chart", "ChartMixin");


test("it works", function() {
  var DummyObject = Ember.Object.extend(ChartMixin);
  var subject = DummyObject.create();

  ok(subject);
});
