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

test("it draws the svg to the right width and height", function() {
  var component = this.subject();

  this.render();

  var chartDiv = component.$().find(".chart");
  var margin = component.get("margin")(
    component.get("xAxisRoom"),
    component.get("yAxisRoom")
  );

  var expectedSvgWidth = chartDiv.width() - margin.right;
  var expectedSvgHeight = component.get("chartDivHeight");

  var svg = component.$().find("svg");

  equal(svg.width(), expectedSvgWidth);
  equal(svg.height(), expectedSvgHeight);
});


test("it draws the right number of bars", function() {
  var expected_n_bars = 5;

  var component = this.subject();  
  
  this.render();

  var svg = component.$().find("svg");
  var bars = svg.find(".bar");

  equal(bars.length, expected_n_bars);
});
