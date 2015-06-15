import { moduleForComponent, test } from "ember-qunit";
import barChartFixture from "../fixtures/bar-chart-fixture";


moduleForComponent("bar-chart", "BarChartComponent", {
  needs: [],
  setup: function() {
    var fixture = barChartFixture();

    this.subject().set("data", fixture.small);
  },
  tearDown: function() {
    //
  }
});

test("it calculates chart title correctly", function() {
  var component = this.subject();
  var titleString = component.get("titleString");

  var expectedTitleString = "count_unique user_id in conditions by name"; // calculated from fixture

  equal(titleString, expectedTitleString);
});
