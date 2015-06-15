import { moduleForComponent, test } from "ember-qunit";
import barChartFixture from "../fixtures/bar-chart-fixture";


moduleForComponent("bar-chart", "BarChartComponent", {
  needs: [],
  setup: function() {
    var fixture = barChartFixture();

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

test("it draws as many bars as groups for a small dataset", function() {
  var component = this.subject();  
  this.render();

  var svg = component.$().find("svg");
  var bars = svg.find(".bar");

  var expected_n_bars = 7;  // from fixture

  equal(bars.length, expected_n_bars);
});

// test("it draws a maximum number of bars for a large dataset", function() {
//   var component = this.subject();  
//   this.render();

//   var svg = component.$().find("svg");
//   var bars = svg.find(".bar");

//   var maxBars = 12;  // from fixture

//   equal(bars.length, expected_n_bars);
// });
