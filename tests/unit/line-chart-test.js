import { moduleForComponent, test } from "ember-qunit";
import lineChartFixture from "../fixtures/line-chart-fixture";


moduleForComponent("line-chart", "LineChartComponent", {
  needs: [],
  setup: function() {
    var fixture = lineChartFixture();

    this.subject().set("data", fixture);
  },
  tearDown: function() {
    //
  }
});

test("it calculates chart title correctly", function() {
  var component = this.subject();
  var titleString = component.get("titleString");

  var expectedTitleString = "count_unique user_id in entries daily over this_14_days";

  equal(titleString, expectedTitleString);
});
