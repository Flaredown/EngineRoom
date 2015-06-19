import { moduleForComponent, test } from "ember-qunit";
import stackedAreaChartFixture from "../fixtures/stacked-area-chart-fixture";

let component;

moduleForComponent("stacked-area-chart", "StackedAreaChartComponent", {
  needs: [],
  setup: function() {
    component = this.subject(
      {data: stackedAreaChartFixture().small}
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

test("it draws stacked areas", function() {
  var processedData = component.get("data").processed;

  var svg = component.$().find("svg");
  var groups = svg.find(".group");

  var expectedGroupN = processedData[0].value.length;
  equal(groups.length, expectedGroupN, "right number of groups");

  // TODO: test properties of the paths themselves?
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

test("it draws a legend", function() {
  var processedData = component.get("data").processed;

  var svg = component.$().find("svg");
  var legendEntries = svg.find(".legend");

  var expectedLegendEntryN = processedData[0].value.length;
  equal(legendEntries.length, expectedLegendEntryN);

  var legendRects = svg.find(".legend rect");
  equal(legendRects.length, expectedLegendEntryN);

  var legendLabels = svg.find(".legend text");
  equal(legendLabels.length, expectedLegendEntryN);

});

test("legend labels are truncated", function() {
  var svg = component.$().find("svg");
  var legendLabels = svg.find(".legend text");
  var longLabel = component.get("groups")[3];  // fragile, depends on fixture

  var magicNumber = 7;  // fragile, depends on component.yAxisRoom and axis label text
  var expectedTruncation = longLabel.slice(0, magicNumber) + "...";

  equal(legendLabels[3].textContent, expectedTruncation);

});

// using other fixtures

test("it updates the chart based on changes in data", function() {
  var svg = component.$().find("svg");

  this.subject().set("data", stackedAreaChartFixture().large);

  equal(svg.find(".group").length, component.get("data").processed[0].value.length,
    "updates to a large dataset: groups"
  );

  equal(svg.find(".legend").length, component.get("data").processed[0].value.length,
    "updates to a large dataset: legend"
  );

  this.subject().set("data", stackedAreaChartFixture().small);

  equal(svg.find(".group").length, component.get("data").processed[0].value.length,
    "updates to a small dataset: groups"
  );

  equal(svg.find(".legend").length, component.get("data").processed[0].value.length,
    "updates to a small dataset: legend"
  );  
});
