import { moduleForComponent, test } from "ember-qunit";
import histogramChartFixture from "../fixtures/histogram-chart-fixture";


moduleForComponent("histogram-chart", "HistogramChartComponent Integration", {
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

test("it sizes the svg based on div size and margin options", function() {
  var component = this.subject();
  this.render();

  var svg = component.$().find("svg");

  ok(svg, "draws the svg");

  var chartDiv = component.$().find(".chart");

  var expectedSvgWidth = chartDiv.width();
  var expectedSvgHeight = component.get("chartDivHeight");

  equal(svg.width(), expectedSvgWidth, "width");
  equal(svg.height(), expectedSvgHeight, "height");
});

test("it draws as many bars as the maximum value in the data + 1 for a small dataset", function() {
  var component = this.subject();  
  this.render();

  var svg = component.$().find("svg");
  var bars = svg.find(".bar");

  var expected_n_bars = 5;  // fragile, from fixture

  equal(bars.length, expected_n_bars);
});

test("it draws the bars to the right height", function() {
  var component = this.subject();  
  this.render();

  var svg = component.$().find("svg");
  var bars = svg.find(".bar");
  var barHeight = parseInt(bars.find("rect").first().attr("height"));

  var expectedBarHeight = 106;  // fragile, depends on fixture and chart height

  equal(barHeight, expectedBarHeight);
});

test("it draws axes", function() {
  var component = this.subject();
  this.render();

  var svg = component.$().find("svg");
  var xAxis = svg.find(".x");
  var yAxis = svg.find(".y");

  ok(xAxis);
  ok(yAxis);
});

test("it writes a chart title", function() {
  var component = this.subject();
  this.render();

  var title = component.$().find(".chart-title");

  var expectedTitle = component.get("titleString");

  equal(title.text(), expectedTitle);
});

// using other fixtures

test("it draws a reasonable number of bars given the chart width for a large dataset", function() {
  var fixture = histogramChartFixture();
  this.subject().set("data", fixture.large);

  var component = this.subject();
  this.render();

  var svg = component.$().find("svg");
  var bars = svg.find(".bar");

  var expected_n_bars = 45;  // fragile, calculated from chart width

  equal(bars.length, expected_n_bars);
});
