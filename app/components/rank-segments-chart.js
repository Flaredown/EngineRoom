import Ember from "ember";
var computed = Em.computed;
var observer = Em.observer;

export default Ember.Component.extend({
    /**
     * @param rawData
     */
    chartSingleGroupCounts: function(rawData) {
        this.drawVerticalBarChart(rawData);
    },

    /**
     * Chart difference between two groups in counts of symptoms, conditions, or treatments.
     * @param rawData {object} [{
         "groupBy": {"sex": "male"},
         "values": [{_id: 'ibs', count: 50}, ...]
      }, ...]
     * @param field {string} 'sex', 'age'
     * @param baselineName {string} baseline group name
     * @param comparisonName {string} group to compare against baseline
     * @param binSize {int} size of histogram bin
     */
    chartBetweenGroupCounts: function(rawData, field, baselineName, comparisonName) {
        console.log('Comparing', comparisonName, 'against', baselineName, 'baseline');

        var mungedData = this.mungeSegmentedData(rawData, field, baselineName, comparisonName);

        this.drawRankChart(mungedData, baselineName, comparisonName);
    },

    chartElement: computed("elementId", function() {
        return "#" + this.get("elementId");
    }),

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
                this.chartSingleGroupCounts(rawData, 'sex', 'male', 'female');
            }
        },

/**
     *
     * @param data -
     * @param rawData {object} [{
         "groupBy": {"sex": "male"},
         "values": [{_id: 'ibs', count: 50}, ...]
      }, ...]
     * @param field {string}
     * @param baselineName {string}
     * @param comparisonName {string}
     * @returns  {baselineData: {
         "groupBy": {"sex": "male"},
         "values": [{_id: 'ibs', count: 50}, ...]
        }, comparisonData: {}
      }
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
    },

    /**
     * Draws a chart that show a ranking of the counts of categories either between two groups or for one group, like the
     * following chart, except color corresponds to categories, not change deltas: https://pbs.twimg.com/media/Bg83Kh6CAAAFWpO.png.
     * @param data {object} either
     * {
     *      baselineData: [{count: 50, _id: 'Depression'}, ...],
     *      comparisonData: [{count: 90, _id: 'IBS'}, ...],
     * } or
     *
     * {baselineData: []}
     * @param baselineName
     * @param comparisonName
     */
    drawRankChart: function(data, baselineName, comparisonName) {
        // TODO - best aspect ratio? Currently 7:5. Also move to controller so both histogram and rank charts have their
        // width/height modified in one place.
        var width = 476;
        var height = 340;
        var outerMargin = {
            top: 10,
            right: 30,
            bottom: 35,
            left: 80
        };
        var xLabelHeight = height - outerMargin.bottom;
        // Margin between tick labels and the bottommost point on the y-axis.
        var axisLabelMargin = {
            x: 10
        };
        var chartTitleTopMargin = 10;
        var innerWidth = width - outerMargin.left - outerMargin.right;
        var innerHeight = height - outerMargin.top - outerMargin.bottom - axisLabelMargin.x;
        var isBetweenGroupComparison = !!data.comparisonData;
        var chartType = this.get('chart-type');
        var title = 'Top ' + chartType;

        // Chart data
        var baselineData = data.baselineData;
        var baselineCount = 0;
        var maxCount;
        var minCount;

        baselineData.forEach(function(d) {
            var count = d.count;

            if (minCount === undefined || count < minCount) {
                minCount = count;
            }

            if (maxCount === undefined || count > maxCount) {
                maxCount = count;
            }

            baselineCount += count;
        });

        if (isBetweenGroupComparison) {
            var comparisonData = data.comparisonData;
            var comparisonCount = 0;

            comparisonData.forEach(function(d) {
                var count = d.count;

                if (count < minCount) {
                    minCount = count;
                }

                if (count > maxCount) {
                    maxCount = count;
                }

                comparisonCount += count;
            });

            var groups = [baselineName, comparisonName];

        } else {
            var groups = [baselineName];
        }

        // Custom colors, can change
        var aquamarine = '#67C2C2';
        var evergreen = 'rgb(144, 197, 144)';
        var magenta = 'rgb(250, 59, 114';
        var colorScale = d3.scale.ordinal()
            .domain(baselineData, function(d) { return d._id; })
            .range(['coral', 'lightblue', 'teal', 'lightgreen', 'lightgrey',
                'darkgrey', 'cornflowerblue', 'orange', 'salmon', 'plum', 'burlywood',
                magenta, aquamarine, evergreen, 'black']);

        var squareSideLengthScale = d3.scale.quantize()
            .domain([minCount, maxCount])
            .range([10, 15, 20, 25]);

        // Scale for the placement of the bars
        var xPositionScale = d3.scale.ordinal()
            .domain(groups)
            .range([outerMargin.left + squareSideLengthScale(maxCount), outerMargin.left + squareSideLengthScale(maxCount) * 8]);

        // Can't use ordinal because the groups may have different categories, so use the group element indexes instead.
        var yScale = d3.scale.linear()
            .domain([0, baselineData.length - 1])
            // #1 is the top ranking, and should be at the top of the chart. Also account for the centering of
            // squares on each tick by providing space for the top half of the topmost square.
            .range([outerMargin.top + squareSideLengthScale(maxCount), innerHeight]);

        var xAxis = d3.svg.axis()
            .scale(xPositionScale)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(yScale)
            // "i" in this case is the index of the element in baselineData, not the element itself as normally
            // works with D3.
            .tickFormat(function(i) { return (baselineData[i]._id); })
            .orient("left");

        var svg = d3.select(this.get('chartElement')).append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr('width', innerWidth)
            .attr('height', innerHeight)
            .attr("transform", "translate(" + outerMargin.left + "," + outerMargin.top + ")");

        var leftTip = d3.tip()
            .attr('class', 'd3-tip left')
            .offset(function(d) {
                var squareLength = squareSideLengthScale(d.count);

                // A bit hacky, but a straightforward way to vertically center the tooltip
                if (squareLength <= 10) {
                    return [22, -63];
                } else if (squareLength <= 15) {
                    return [24, -70];
                } else if (squareLength <= 20) {
                    return [27, -73];
                } else {
                    return [30, -75];
                }

            })
            .html(function(d) {
                return "<strong class='tooltip-text'>Count:</strong> <span class='tooltip-text'>" + d.count + "</span>";
            });

        var rightTip = d3.tip()
            .attr('class', 'd3-tip right')
            .offset(function(d) {
                var squareLength = squareSideLengthScale(d.count);

                // A bit hacky, but a straightforward way to vertically center the tooltip
                if (squareLength <= 10) {
                    return [22, 63];
                } else if (squareLength <= 15) {
                    return [24, 66];
                } else if (squareLength <= 20) {
                    return [27, 73];
                } else {
                    return [30, 75];
                }

            })
            .html(function(d) {
                return "<strong class='tooltip-text'>Count:</strong> <span class='tooltip-text'>" + d.count + "</span>";
            });

        var baselineSquares = svg.selectAll(".baseline.square")
            .data(baselineData)
            .enter().append("rect")
            .attr("class", 'baseline square')
            .attr('x', function(d) { return xPositionScale(groups[0]) - squareSideLengthScale(d.count) / 2 })
            .attr("y", function(d, i) { return yScale(i) - squareSideLengthScale(d.count) / 2; })
            .attr("width", function(d) { return squareSideLengthScale(d.count);})
            .attr("height", function(d) { return squareSideLengthScale(d.count);})
            .style('fill', function(d) { return colorScale(d._id)})
            // TODO - how to style the linked comparison group square and the linkerLine at the same time?
            .on('mouseover', rightTip.show)
            .on('mouseout', rightTip.hide);

        svg.call(leftTip);
        svg.call(rightTip);

        if (isBetweenGroupComparison) {
            var comparisonSquares = svg.selectAll("comparison.square")
                .data(comparisonData)
                .enter().append("rect")
                .attr("class", 'comparison square')
                .attr('x', function(d) { return xPositionScale(groups[1]) - squareSideLengthScale(d.count) / 2 })
                .attr("y", function(d, i) { return yScale(i) - squareSideLengthScale(d.count) / 2; })
                .attr("width", function(d) { return squareSideLengthScale(d.count);})
                .attr("height", function(d) { return squareSideLengthScale(d.count);})
                .style('fill', function(d) { return colorScale(d._id)})
                .on('mouseover', leftTip.show)
                .on('mouseout', leftTip.hide);

            /**
             * Used to construct linker lines. Maps index of object containing _id in baseline group to index of object
             * containing corresponding _id in comparison group, and visa versa.
             * @returns {'baseline': { 1: {count: 50, rank: 2}, 2: {count: 100, rank: 1}, ...}, ...}
             */
            function constructGroupMap(baselineData, comparisonData) {
                var groupMap = {'baseline': {}, 'comparison': {}};

                for (var i = 0; i < baselineData.length; i++) {
                    if (groupMap.baseline[i] == undefined) {
                        var hasMatchingGroup = false;

                        for (var j = 0; j < comparisonData.length; j++) {
                            if (baselineData[i]._id === comparisonData[j]._id) {
                                groupMap.baseline[i] = {
                                    count: comparisonData[j].count,
                                    rank: j
                                };
                                groupMap.comparison[j] = {
                                    count: baselineData[i].count,
                                    rank: i
                                };
                                hasMatchingGroup = true;
                                break;
                            }
                        }
                        if (!hasMatchingGroup) {
                            groupMap.baseline[i] = null;
                        }
                    }
                }

                // Find any comparison _id's without a matching baseline _id
                for (var i = 0; i < comparisonData.length; i++) {
                    if (groupMap.comparison[i] == undefined) {
                        var hasMatchingGroup = false;

                        for (var j = 0; j < baselineData.length; j++) {
                            if (comparisonData[i]._id === baselineData[j]._id) {
                                groupMap.comparison[i] = {
                                    count: baselineData[j].count,
                                    rank: j
                                };
                                groupMap.baseline[j] = {
                                    count: comparisonData[i].count,
                                    rank: i
                                };
                                hasMatchingGroup = true;
                                break;
                            }
                        }
                        if (!hasMatchingGroup) {
                            groupMap.comparison[i] = null;
                        }
                    }
                }

                return groupMap;
            }

            var groupMap = constructGroupMap(baselineData, comparisonData);

            var linkerLines = svg.selectAll("lines")
                .data(baselineData)
                .enter().append("line")
                .attr("class", 'linkerLine')
                .attr('x1', function(d) { return xPositionScale(groups[0]) - squareSideLengthScale(d.count) / 2; })
                .attr('x2', function(d, i) {
                    var cData = groupMap.baseline[i];

                    if (cData == null) {
                        // Has no corresponding rank in the top 10 of comparison group. Draw line to axis tick label of comparison group.
                        return xPositionScale(groups[1]);
                    }
                    return xPositionScale(groups[1]) - squareSideLengthScale(cData.count) / 2;
                })
                .attr("y1", function(d, i) { return yScale(i);})
                .attr("y2", function(d, i) {
                    var cData = groupMap.baseline[i];

                    if (cData == null) {
                        // Has no corresponding rank in the top 10 of comparison group. Draw line to axis tick label of comparison group.
                        return xLabelHeight;
                    }
                    return yScale(cData.rank);
                })
                .attr("width", function(d) { return squareSideLengthScale(d.count);})
                .attr("height", function(d) { return squareSideLengthScale(d.count);})
                .style('stroke', function(d) { return colorScale(d._id)});

            var orphanComparisonGroupLines = svg.selectAll("lines")
                .data(comparisonData)
                .enter().append("line")
                .attr("class", 'linkerLine')
                .attr('x1', function(d) { return xPositionScale(groups[1]) - squareSideLengthScale(d.count) / 2; })
                .attr('x2', function(d, i) {
                    var bData = groupMap.comparison[i];
                    // Has no corresponding rank in the top 10 of baseline group. Draw line to axis tick label of baseline group.
                    if (bData == null) {
                        return xPositionScale(groups[0]);
                    }
                    return xPositionScale(groups[1]);
                })
                .attr("y1", function(d, i) { return yScale(i);})
                .attr("y2", function(d, i) {
                    var bData = groupMap.comparison[i];
                    if (bData == null) {
                        // Has no corresponding rank in the top 10 of group 2. Draw line to axis tick label of group 2.
                        return xLabelHeight;
                    }
                    // Don't draw a line, because a line already exists between the comparison ranking and its
                    // corresponding baseline ranking.
                    return yScale(i);
                })
                .attr("width", function(d) { return squareSideLengthScale(d.count);})
                .attr("height", function(d) { return squareSideLengthScale(d.count);})
                .style('stroke', function(d) { return colorScale(d._id)});
        }

        svg.append("g")
            .attr("class", "x axis transparent")
            .attr("transform", "translate(0, " + (xLabelHeight) + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + (outerMargin.left) + ", 0)")
            .call(yAxis);

        var spaceBetweenGroups = xPositionScale(groups[1]) - xPositionScale(groups[0]);
        var chartTitleLeftMargin = innerWidth/2;
        // Chart title.
        // Example: "Number of conditions"
        svg.append('text')
            .attr("text-anchor", "middle")
            .attr('transform', 'translate(' + chartTitleLeftMargin + ', ' + chartTitleTopMargin + ')')
            .text(title);
    },

    /**
     * @param data {array} [{_id: 'depression', count:102}, ...]
     */
    drawVerticalBarChart: function(data) {
        // Chart options
        // TODO - best aspect ratio? Currently 7:5.
        var width = 420;
        var height = 300;
        var outerMargin = {
            top: 22,
            right: 30,
            bottom: 40,
            left: 80
        };
        var axisLabelMargin = {
            x: 10,
            y: 3
        };
        var chartTitleMargin = 5;
        var innerWidth = width - outerMargin.left - outerMargin.right;
        var innerHeight = height - outerMargin.top - outerMargin.bottom;
        var title = 'Top ' + this.get('chart-type');
        var xLabel = 'Count';

        var countExtent = d3.extent(data, function(d) { return d.count; });
        var minCount = countExtent[0];
        var maxCount = countExtent[1];

        var binMargin = .2;
        var binHeight = 2;

        // Scale for the placement of the bars
        var xScale = d3.scale.linear()
            .domain([0, maxCount])
            .range([outerMargin.left, innerWidth]);

        var yScale = d3.scale.linear()
            .domain([0, data.length - 1])
            .range([outerMargin.top, innerHeight]);

        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(yScale)
            // "i" in this case is the index of the element in baselineData, not the element itself as normally
            // works with D3.
            .tickFormat(function(i) { return (data[i]._id); })
            .orient("left");

        var svg = d3.select(this.get('chartElement')).append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr('width', innerWidth)
            .attr('height', innerHeight)
            .attr("transform", "translate(" + outerMargin.left + "," + outerMargin.top + ")");

        var topTip = d3.tip()
            .attr('class', 'd3-tip top')
            .offset([-10, 0])
            .html(function(d) {
                return "<strong class='tooltip-text'>Count:</strong> <span class='tooltip-text'>" + d.count + "</span>";
            });

        svg.call(topTip);

        // Change if we decide to not make all bins the same width
        // yScale maps increasing positive numbers to increasing negative numbers
        var renderedBinHeight = Math.abs(yScale(1 - 2 * binMargin) - yScale(0));

        var bar = svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr('class', 'bar')
            .attr('x', outerMargin.left)
            // "y" is y-coordinate of upper left corner of rectangle, so move it up 1/2 the height.
            .attr('y', function(d, i) { return yScale(i) - renderedBinHeight/2; })
            .attr('width', function(d) { return xScale(d.count); })
            .attr('height', renderedBinHeight)
            .on('mouseover', topTip.show)
            .on('mouseout', topTip.hide);


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

        // Chart title.
        // Example: "Number of conditions"
        svg.append('text')
            .attr("text-anchor", "middle")
            .attr('transform', 'translate(' + (innerWidth/2) + ', ' + chartTitleMargin + ')')
            .text(title);
    }
});
