import { moduleForComponent, test } from "ember-qunit";
import ringChartFixture from "../fixtures/ring-chart-fixture";

let component;

moduleForComponent("ring-chart", "RingChartComponent", {
  needs: [],
  setup: function() {
    component = this.subject(
      {data: ringChartFixture().small}
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

test("it draws arcs", function() {
  var processedData = component.get("data").processed;

  var svg = component.$().find("svg");
  var groups = svg.find(".group");

  var expectedGroupN = processedData.length;
  equal(groups.length, expectedGroupN, "right number of groups");

  // TODO: test properties of the arcs themselves?
});

test("it draws labels in arcs", function() {
  var processedData = component.get("data").processed;

  var svg = component.$().find("svg");
  var groups = svg.find(".group");
  var groupLabels = groups.find("text");

  var expectedGroupN = processedData.length;
  equal(groupLabels.length, expectedGroupN, "right number of labels");

  // TODO: test properties of the labels?
});

test("it formats arc labels correctly", function() {
  var svg = component.$().find("svg");
  var groups = svg.find(".group");
  var groupLabels = groups.find("text");

  var expectedLabel = "6%";  // fragile, depends on fixture
  equal(groupLabels[0].textContent, expectedLabel);
});

test("it doesn't draw axes", function() {
  var svg = component.$().find("svg");
  var xAxis = svg.find(".x");
  var yAxis = svg.find(".y");

  equal(xAxis.length, 0);
  equal(yAxis.length, 0);
});

test("it writes a chart title", function() {
  var title = component.$().find(".chart-title");

  equal(title.text(), component.get("titleString"));
});

test("it draws a legend", function() {
  var processedData = component.get("data").processed;

  var svg = component.$().find("svg");
  var legendEntries = svg.find(".legend");

  var expectedLegendEntryN = processedData.length;
  equal(legendEntries.length, expectedLegendEntryN);

  var legendRects = svg.find(".legend rect");
  equal(legendRects.length, expectedLegendEntryN);

  var legendLabels = svg.find(".legend text");
  equal(legendLabels.length, expectedLegendEntryN);

});

test("legend labels are truncated", function() {
  var svg = component.$().find("svg");
  var legendLabels = svg.find(".legend text");
  var longLabel = component.get("groups")[5];  // fragile, depends on fixture

  var magicNumber = 10;  // fragile, depends on component.yAxisRoom and axis label text
  var expectedTruncation = longLabel.slice(0, magicNumber) + "...";

  equal(legendLabels[5].textContent, expectedTruncation);

});

// using other fixtures

test("it updates the chart based on changes in data", function() {
  var svg = component.$().find("svg");

  this.subject().set("data", ringChartFixture().large);

  equal(svg.find(".group").length, component.get("data").processed.length,
    "updates to a large dataset: groups"
  );

  equal(svg.find(".group text").length, component.get("data").processed.length,
    "updates to a large dataset: group labels"
  );

  equal(svg.find(".legend").length, component.get("data").processed.length,
    "updates to a large dataset: legend"
  );

  this.subject().set("data", ringChartFixture().small);

  equal(svg.find(".group").length, component.get("data").processed.length,
    "updates to a small dataset: groups"
  );

  equal(svg.find(".group text").length, component.get("data").processed.length,
    "updates to a small dataset: group labels"
  );  

  equal(svg.find(".legend").length, component.get("data").processed.length,
    "updates to a small dataset: legend"
  );  
});
