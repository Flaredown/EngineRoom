import { moduleForComponent, test } from "ember-qunit";
import barChartFixture from "../fixtures/bar-chart-fixture";

let component;

moduleForComponent("bar-chart", "BarChartComponent", {
  needs: [],
  setup: function() {
    component = this.subject(
      {data: barChartFixture().small}
    );
    this.render();    
  },
  tearDown: function() {
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

test("it draws as many bars as groups for a small dataset", function() {
  var component = this.subject();  
  this.render();

  var svg = component.$().find("svg");
  var bars = svg.find(".bar");

  var expected_n_bars = 7;  // fragile, depends on fixture

  equal(bars.length, expected_n_bars);
});

test("it draws the bars to the right width", function() {
  var component = this.subject();  
  this.render();

  var svg = component.$().find("svg");
  var bars = svg.find(".bar");
  var barWidth = parseInt(bars.first().attr("width"));

  var expectedBarWidth = 1150;  // fragile, depends on fixture and chart width

  equal(barWidth, expectedBarWidth);
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

//

test("it truncates long y-axis labels", function() {
  var longLabel = component.get("data").processed[0].name;  // fragile, depends on fixture

  var yAxis = component.$().find(".y");
  var yAxisLabels = yAxis.find("text");

  var magicNumber = 12;  // fragile, depends on component.yAxisRoom and axis label text
  var expectedTruncation = longLabel.slice(0, magicNumber) + "...";

  equal(yAxisLabels[0].textContent, expectedTruncation);
});

// using other fixtures

test("it updates the chart based on changes in data", function() {
  var svg = component.$().find("svg");

  this.subject().set("data", barChartFixture().large);

  equal(svg.find(".bar").length, component.get("maxBars"),
    "updates to large dataset and shows a maximum number of bars");

  this.subject().set("data", barChartFixture().small);

  equal(svg.find(".bar").length, 7, "updates to small dataset and shows all bars");
});
