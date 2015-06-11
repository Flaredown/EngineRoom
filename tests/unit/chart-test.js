import { moduleFor, test } from "ember-qunit";
import ChartMixin from "../../mixins/chart";

moduleFor("mixin:chart", "ChartMixin");


test("margins are calculated with room for axes", function() {
  var DummyObject = Ember.Object.extend(ChartMixin);
  var subject = DummyObject.create();

  var xAxisRoom = 10;
  var yAxisRoom = 20;
  var marginBase = 12;
  var margin = subject.get("margin")(xAxisRoom, yAxisRoom);
  
  equal(margin.top, marginBase, "top");
  equal(margin.right, marginBase, "right");
  equal(margin.bottom, marginBase + xAxisRoom, "bottom");
  equal(margin.left, marginBase + yAxisRoom, "left");
});
