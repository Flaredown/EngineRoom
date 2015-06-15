import { moduleForComponent, test } from 'ember-qunit';
import histogramChartFixture from '../fixtures/histogram-chart-fixture';


moduleForComponent("histogram-chart", "HistogramChartComponent", {
  needs: [],
  setup: function() {
    var fixture = histogramChartFixture();

    this.subject().set("data", fixture.small);
  },
  tearDown: function() {
    //
  }
});

test("it calculates chart title correctly", function() {
  var component = this.subject();
  var titleString = component.get("titleString");

  var expectedTitleString = "count_unique user_id in entries by n_conditions"; // calculated from fixture

  equal(titleString, expectedTitleString);
});
