import { moduleForComponent, test } from "ember-qunit";
import stackedAreaChartFixture from "../fixtures/stacked-area-chart-fixture";


moduleForComponent("stacked-area-chart", "StackedAreaChartComponent", {
  needs: [],
  setup: function() {
    var fixture = stackedAreaChartFixture();

    this.subject().set("data", fixture);
  },
  tearDown: function() {
    //
  }
});

test("it calculates chart title correctly", function() {
  var component = this.subject();
  var titleString = component.get("titleString");

  var expectedTitleString = "count_unique session_id in pageviews by user_agent.browser.name daily over this_14_days";

  equal(titleString, expectedTitleString);
});
