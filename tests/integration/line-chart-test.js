import { moduleForComponent, test } from 'ember-qunit';
import lineChartFixture from '../fixtures/line-chart-fixture';


moduleForComponent("line-chart", "LineChartComponent", {
  needs: [],
  setup: function() {
    var fixture = lineChartFixture();

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

test("it draws a line", function() {
  var component = this.subject();  
  this.render();

  var svg = component.$().find("svg");
  var line = svg.find(".line");

  ok(line);
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

  var expectedTitle = "Shop";

  equal(title.text(), expectedTitle);
});

