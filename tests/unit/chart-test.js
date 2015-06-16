import { moduleFor, test } from "ember-qunit";
import ChartMixin from "../../mixins/chart";

moduleFor("mixin:chart", "ChartMixin");


test("margins are calculated with room for axes", function() {
  var DummyObject = Ember.Object.extend(ChartMixin);
  var subject = DummyObject.create();

  var xAxisRoom = 10;
  var yAxisRoom = 20;
  var legendRoom = 30;

  var margin = subject.get("margin")(xAxisRoom, yAxisRoom, legendRoom);
  
  var marginBase = 12;
  
  equal(margin.top, marginBase, "top");
  equal(margin.right, marginBase + legendRoom, "right");
  equal(margin.bottom, marginBase + xAxisRoom, "bottom");
  equal(margin.left, marginBase + yAxisRoom, "left");
});
