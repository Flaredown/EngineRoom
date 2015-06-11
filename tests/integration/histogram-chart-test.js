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

test("it sizes the svg based on div size and margin options", function() {
  var component = this.subject();
  this.render();

  var svg = component.$().find("svg");

  var chartDiv = component.$().find(".chart");
  var margin = component.get("margin")(
    component.get("xAxisRoom"),
    component.get("yAxisRoom")
  );
  var expectedSvgWidth = chartDiv.width() - margin.right;
  var expectedSvgHeight = component.get("chartDivHeight");

  equal(svg.width(), expectedSvgWidth, "width");
  equal(svg.height(), expectedSvgHeight, "height");
});

test("it draws as many bars as the maximum value + 1 for a small dataset", function() {
  var component = this.subject();  
  this.render();

  var svg = component.$().find("svg");
  var bars = svg.find(".bar");

  var expected_n_bars = 5;  // from fixture

  equal(bars.length, expected_n_bars);
});

test("it draws a reasonable number of bars given the chart width for a large dataset", function() {
  var fixture = histogramChartFixture();
  this.subject().set("data", fixture.large);

  var component = this.subject();
  this.render();

  var svg = component.$().find("svg");
  var bars = svg.find(".bar");

  var expected_n_bars = 45;  // calculated from chart width

  equal(bars.length, expected_n_bars);
});