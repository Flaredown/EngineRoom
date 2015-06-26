import { moduleForComponent, test } from "ember-qunit";
import histogramChartFixture from "../fixtures/histogram-chart-fixture";

let component;

moduleForComponent("histogram-chart", "HistogramChartComponent", {
  needs: [],
  setup: function() {
    component = this.subject(
      {data: histogramChartFixture().small}
    );
    this.render();
  },
  teardown: function() {
    //
  }
});

test("it sizes the svg based on div size and margin options", function() {
  var svg = component.$().find("svg");

  ok(svg, "draws the svg");

  var chartDiv = component.$().find(".chart");

  var expectedSvgWidth = chartDiv.width();
  var expectedSvgHeight = component.get("chartDivHeight");

  equal(svg.width(), expectedSvgWidth, "width");
  equal(svg.height(), expectedSvgHeight, "height");
});

test("it draws as many bars as the maximum value in the data + 1 for a small dataset", function() {
  var svg = component.$().find("svg");

  var expected_n_bars = 5;  // fragile, from fixture

  equal(svg.find(".bar").length, expected_n_bars);
});

test("it draws the bars to the right height", function() {
  var svg = component.$().find("svg");
  var bars = svg.find(".bar");
  var barHeight = parseInt(bars.first().attr("height"));

  var expectedBarHeight = 159;  // fragile, depends on fixture and chart height

  equal(barHeight, expectedBarHeight);
});

test("it draws axes", function() {
  var svg = component.$().find("svg");
  var xAxis = svg.find(".x");
  var yAxis = svg.find(".y");

  ok(xAxis);
  ok(yAxis);
});

test("it writes a chart title", function() {
  var title = component.$().find(".chart-title");

  equal(title.text(), component.get("titleString"));
});

// using other fixtures

test("it updates the chart based on changes in data", function() {
  var svg = component.$().find("svg");
  component.set("data", histogramChartFixture().large);

  equal(svg.find(".bar").length, 45, "updates to large dataset, calculating nBins based on chart width");

  component.set("data", histogramChartFixture().small);

  equal(svg.find(".bar").length, 5, "updates to small dataset");
});
