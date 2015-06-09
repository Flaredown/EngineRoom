/* global Ember, equal, ok */

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

test("it renders", function() {
  var component = this.subject();
  equal(component._state, "preRender");

  this.render();

  equal(component._state, "inDOM");
});

test("it draws an svg", function() {
  var component = this.subject();

  this.render();

  ok(component.$().find("svg"));
});
