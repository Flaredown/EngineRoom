import Ember from "ember";
var computed = Em.computed;
var observer = Em.observer;


export default Ember.Component.extend({
    /**
     *
     * @param rawData
     * @param category {string} "n_symptoms"
     * @param binSize
     */
    chartSingleGroupCounts: function(rawData, binSize) {
        var mungedData = this.mungeData(rawData);
        var binSize = binSize || 2;
        var chartOptions = {
            binSize: binSize,
            chartTypeName: this.get('chart-type')
        };

        var keys = Object.keys(mungedData);

        // keys of data, "_id"s, are the "number of conditions/symptoms/treatments". The value type is String.
        var extent = d3.extent(Object.keys(mungedData), function(d) {
            return parseInt(d);
        });
        var min = extent[0];
        // histograms in R hist() are left-open and right-closed by default.
        var max = extent[1];

        this.drawHistogramChart(mungedData, max, min, chartOptions);
    },

    /**
     * Chart difference between two groups in counts of symptoms, conditions, or treatments.
     * @param el {object} object to append chart to in the DOM
     * @param rawData {object} the two groups of data wrapped in an object
     * @param field {string} 'sex', 'age'
     * @param baselineName {string} baseline group name
     * @param comparisonName {string} group to compare against baseline
     * @param binSize {int} size of histogram bin
     */
    chartBetweenGroupCounts: function(rawData, field, baselineName, comparisonName, binSize) {
        console.log('Comparing', comparisonName, 'against', baselineName, 'baseline');

        var mungedData = this.mungeSegmentedData(rawData, field, baselineName, comparisonName);
        var diffDataRecord = this.computeGroupDifferences(mungedData.baselineData, mungedData.comparisonData);
        var binSize = binSize || 2;
        var chartOptions = {
            binSize: binSize,
            chartTypeName: this.get('chart-type')
        };

        var totalData = mungedData.baselineData.concat(mungedData.comparisonData);

        // keys of diffDataRecord, "_id"s, are the "number of conditions/symptoms/treatments". The value type is String.
        var extent = d3.extent(totalData, function(d) {
            return d._id;
        });
        var min = extent[0];
        // histograms in R hist() are left-open and right-closed by default.
        var max = extent[1];

        this.drawHistogramChart(diffDataRecord, max, min, chartOptions);
    },
    chartElement: computed("elementId", function() {
        return "#" + this.get("elementId");
    }),
    /**
     *
     * @param baselineData
     * @param comparisonData
     * @returns {{}} differences between groups at each count level, example: {1: -30, 2: 20, 3: -100, 4: 0}
     */
    computeGroupDifferences: function(baselineData, comparisonData) {
        // Munge to compute diffs
        // {1 : 300, 2: 30, 4: 50}
        var diffDataRecord = {};
        comparisonData.forEach(function(obj) {
            diffDataRecord[obj._id] = obj.count;
        });

        // {1: -30, 2: 20, 3: -100, 4: 0}
        baselineData.forEach(function(obj) {
            var comparisonCount = diffDataRecord[obj._id];

            if (comparisonCount === undefined) {
                diffDataRecord[obj._id] = 0 - obj.count;
            } else {
                diffDataRecord[obj._id] = comparisonCount - obj.count;
            }
        });

        return diffDataRecord;
    },
    // Where D3 logic hooks into the model
    dataChanged: observer("data", function() {
        this.drawD3();
    }).on("didInsertElement"),

    /**
     * Redraw the entire chart on data change, because the axes potentially change.
     */
    drawD3: function() {
        var rawData = this.get('data');
        var isSegmented = this.get('is-segmented');

        if (isSegmented) {
            this.chartBetweenGroupCounts(rawData, 'sex', 'male', 'female');
        } else {
            this.chartSingleGroupCounts(rawData);
        }
    },

    /**
     *
     * @param data {object} {1: -30, 2: 20, 3: -100, 4: 0}
     * @param max
     * @param min
     * @param chartOptions
     */
    drawHistogramChart: function(data, max, min, chartOptions) {
        // Chart options
        // TODO - best aspect ratio? Currently 7:5. Also move to controller so both histogram and rank charts have their
        // width/height modified in one place.
        var width = 476;
        var height = 340;
        var outerMargin = {
            top: 10,
            right: 30,
            bottom: 35,
            left: 40
        };
        var axisLabelMargin = {
            x: 10,
            y: 3
        };
        var chartTitleMargin = 5;
        var innerWidth = width - outerMargin.left - outerMargin.right;
        var innerHeight = height - outerMargin.top - outerMargin.bottom;
        // TODO - use Freedman-Diaconis for default bin size
        var binSize = chartOptions.binSize || 2;
        var title = 'Number of ' + chartOptions.chartTypeName;
        var xLabel = 'Number of ' + chartOptions.chartTypeName;
        var yLabel = 'Count difference';

        var numBins = (max + 1 - min) / binSize;

        var histData = [];
        var currentBin = min;

        // object --> array of binned objects
        // {1: -30, 2: 20, 3: -100, 4: 0} --> [{bin: 0, diff: -30}, {bin: 2, diff: -80}, {bin: 4, diff:0}]
        for (var binNum = 0; binNum < numBins; binNum++) {
            var binDiffCount = 0;

            for (var i = currentBin; i < currentBin + binSize; i++) {
                if (data[i] != undefined) {
                    binDiffCount += data[i];
                }
            }

            histData.push({bin: currentBin, diff: binDiffCount});
            currentBin += binSize;
        }

        var diffExtent = d3.extent(histData, function(d) { return d.diff; });
        var minDiff = diffExtent[0];
        var maxDiff = diffExtent[1];

        // TODO - figure out how to conditionally set the tooltip class attr by negative and positive, so that this
        // splitting data step (and applying a different tooltip to each data set) is unnecessary
        var negativeData = [];
        var positiveData = [];
        for (var i = 0; i < histData.length; i++) {
            if (histData[i].diff < 0) {
                negativeData.push(histData[i]);
            } else {
                positiveData.push(histData[i]);
            }
        }

        var binMargin = .2;

        // Scale for the placement of the bars
        var xPositionScale = d3.scale.linear()
            .domain([min, max])
            .range([outerMargin.left, innerWidth]);

        var yScale = d3.scale.linear()
            .domain([minDiff, maxDiff])
            .range([innerHeight, outerMargin.top]);

        var xAxis = d3.svg.axis()
            .scale(xPositionScale)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left");

        var svg = d3.select(this.get('chartElement')).append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr('width', innerWidth)
            .attr('height', innerHeight)
            .attr("transform", "translate(" + outerMargin.left + "," + outerMargin.top + ")");

        var positiveTip = d3.tip()
            .attr('class', 'd3-tip top')
            .offset([-10, 0])
            .html(function(d) {
                return "<strong class='tooltip-text'>Diff:</strong> <span class='tooltip-text'>" + d.diff + "</span>";
            });

        var negativeTip = d3.tip()
            .attr('class', 'd3-tip top negative')
            .offset([-10, 0])
            .html(function(d) {
                return "<strong class='tooltip-text'>Diff:</strong> <span class='tooltip-text'>" + d.diff + "</span>";
            });

        svg.call(positiveTip);
        svg.call(negativeTip);

        // Change if we decide to not make all bins the same width
        var renderedBinWidth = Math.abs(xPositionScale(binSize - 2 * binMargin) - xPositionScale(0));

        var positiveBars = svg.selectAll(".bar.positive")
            .data(positiveData)
            .enter().append("rect")
            .attr("class", 'bar positive')
            .attr('x', function(d) { return xPositionScale(d.bin + binMargin); })
            .attr("y", function(d) { return yScale(Math.max(0, d.diff)); })
            .attr('width', renderedBinWidth)
            .attr("height", function(d) { return Math.abs(yScale(d.diff) - yScale(0)); })
            .on('mouseover', positiveTip.show)
            .on('mouseout', positiveTip.hide);

        var negativeBars = svg.selectAll(".bar.negative")
            .data(negativeData)
            .enter().append("rect")
            .attr("class", 'bar negative')
            .attr('x', function(d) { return xPositionScale(d.bin + binMargin); })
            .attr("y", function(d) { return yScale(Math.max(0, d.diff)); })
            .attr('width', renderedBinWidth)
            .attr("height", function(d) { return Math.abs(yScale(d.diff) - yScale(0)); })
            .on('mouseover', negativeTip.show)
            .on('mouseout', negativeTip.hide);
//            .on('mouseover', tip.show)
//            .on('mouseout', tip.hide);

        svg.append("line")
            .attr("class", "baseline-line")
            .attr("y1", yScale(0))
            .attr("y2", yScale(0))
            .attr("x1", outerMargin.left)
            // account for width of last bin being 1/2 a bin wider than the inner width of the chart.
            .attr("x2", innerWidth + renderedBinWidth/2);

        svg.append("g")
            .attr("class", "x axis transparent")
            .attr("transform", "translate(0, " + (height - outerMargin.bottom) + ")")
            .call(xAxis)
            .append('text')
            .attr('class', 'x-label label')
            .attr('transform', 'translate(' + (innerWidth/2 - outerMargin.left) + ',' + (outerMargin.bottom + axisLabelMargin.x) + ')')
            .text(xLabel);

        svg.append("g")
            .attr("class", "y axis transparent")
            .attr("transform", "translate(" + (outerMargin.left) + ", 0)")
            .call(yAxis)
            .append('text')
            .attr('class', 'y-label label')
            .attr('transform', 'translate(' + -(outerMargin.left + axisLabelMargin.y) +',' + (height/2 + outerMargin.top) + ') rotate(' + (-90) + ')')
            .text(yLabel);

        // Chart title.
        // Example: "Number of conditions"
        svg.append('text')
            .attr("text-anchor", "middle")
            .attr('transform', 'translate(' + (innerWidth/2) + ', ' + chartTitleMargin + ')')
            .text(title);
    },

    /**
     * Converts array of objects to an object.
     * @param data {object}
     *  [{"_id": 0,  "count": 94}, ...]
     *  @returns {object} {data: {1: 30, 2: 40}}
     */
    mungeData: function(data) {
        var dataRecord = {};

        data.forEach(function(el) {
            dataRecord[el._id] = el.count;
        });

        return dataRecord;
    },

    /**
     *
     * @param data -
     *  [
     *      {"groupBy": {"sex": "female"},
     *      "values": [{"_id": 0,  "count": 94}, ...]
     *  }]
     * @param field
     * @param baselineName
     * @param comparisonName
     * @returns {{baselineData: {groupBy: 'male', values: []}, comparisonData: {groupBy:'female', values: []}}
     */
    mungeSegmentedData: function(data, field, baselineName, comparisonName) {
        var firstGroupName = data[0].groupBy[field];
        var secondGroupName = data[1].groupBy[field];

        if (firstGroupName === baselineName && secondGroupName === comparisonName) {
            var baselineData = data[0].values;
            var comparisonData = data[1].values;
        } else if (firstGroupName === comparisonName && secondGroupName === baselineName) {
            var baselineData = data[1].values;
            var comparisonData = data[0].values;
        } else {
            console.error('Expected baseline group name and comparison group name do not match the data\'s group names.');
        }

        return {
            baselineData: baselineData,
            comparisonData: comparisonData
        }
    }
});