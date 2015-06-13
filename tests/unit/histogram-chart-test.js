import { moduleForComponent, test } from 'ember-qunit';
import histogramChartFixture from '../fixtures/histogram-chart-fixture';


moduleForComponent("histogram-chart", "HistogramChartComponent", {
  needs: [],
  setup: function() {
    var fixture = histogramChartFixture();

    this.subject().set("data", fixture);
  },
  tearDown: function() {
    //
  }
});
