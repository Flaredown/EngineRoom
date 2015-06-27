var fixture = function() {
  return {
    small: {
      specs: {
        "chartType": "stackedArea",
        "queryType": "count_unique",
        "queryParams": {
          "eventCollection": "pageviews",
          "targetProperty": "session_id",
          "groupBy": "user_agent.browser.name",
          "timeframe": "this_7_days",
          "interval": "daily"
        }
      },
      raw: [
        {"value":[{"user_agent.browser.name":"Chrome","result":32},{"user_agent.browser.name":"Firefox","result":12},{"user_agent.browser.name":"IE","result":1},{"user_agent.browser.name":"Mobile Safari","result":7},{"user_agent.browser.name":"Safari","result":4},{"user_agent.browser.name":"WebKit","result":0}],"timeframe":{"start":"2015-06-10T04:00:00.000Z","end":"2015-06-11T04:00:00.000Z"}},
        {"value":[{"user_agent.browser.name":"Chrome","result":37},{"user_agent.browser.name":"Firefox","result":12},{"user_agent.browser.name":"IE","result":1},{"user_agent.browser.name":"Mobile Safari","result":21},{"user_agent.browser.name":"Safari","result":7},{"user_agent.browser.name":"WebKit","result":2}],"timeframe":{"start":"2015-06-11T04:00:00.000Z","end":"2015-06-12T04:00:00.000Z"}},
        {"value":[{"user_agent.browser.name":"Chrome","result":28},{"user_agent.browser.name":"Firefox","result":13},{"user_agent.browser.name":"IE","result":0},{"user_agent.browser.name":"Mobile Safari","result":16},{"user_agent.browser.name":"Safari","result":8},{"user_agent.browser.name":"WebKit","result":0}],"timeframe":{"start":"2015-06-12T04:00:00.000Z","end":"2015-06-13T04:00:00.000Z"}},
        {"value":[{"user_agent.browser.name":"Chrome","result":16},{"user_agent.browser.name":"Firefox","result":7},{"user_agent.browser.name":"IE","result":0},{"user_agent.browser.name":"Mobile Safari","result":10},{"user_agent.browser.name":"Safari","result":11},{"user_agent.browser.name":"WebKit","result":0}],"timeframe":{"start":"2015-06-13T04:00:00.000Z","end":"2015-06-14T04:00:00.000Z"}},
        {"value":[{"user_agent.browser.name":"Chrome","result":28},{"user_agent.browser.name":"Firefox","result":15},{"user_agent.browser.name":"IE","result":0},{"user_agent.browser.name":"Mobile Safari","result":11},{"user_agent.browser.name":"Safari","result":10},{"user_agent.browser.name":"WebKit","result":1}],"timeframe":{"start":"2015-06-14T04:00:00.000Z","end":"2015-06-15T04:00:00.000Z"}},
        {"value":[{"user_agent.browser.name":"Chrome","result":26},{"user_agent.browser.name":"Firefox","result":12},{"user_agent.browser.name":"IE","result":1},{"user_agent.browser.name":"Mobile Safari","result":9},{"user_agent.browser.name":"Safari","result":5},{"user_agent.browser.name":"WebKit","result":0}],"timeframe":{"start":"2015-06-15T04:00:00.000Z","end":"2015-06-16T04:00:00.000Z"}},
        {"value":[{"user_agent.browser.name":"Chrome","result":25},{"user_agent.browser.name":"Firefox","result":8},{"user_agent.browser.name":"IE","result":1},{"user_agent.browser.name":"Mobile Safari","result":4},{"user_agent.browser.name":"Safari","result":5},{"user_agent.browser.name":"WebKit","result":0}],"timeframe":{"start":"2015-06-16T04:00:00.000Z","end":"2015-06-17T04:00:00.000Z"}}
      ]
    },
    large: {
      specs: {
        "chartType": "stackedArea",
        "queryType": "count_unique",
        "queryParams": {
          "eventCollection": "pageviews",
          "targetProperty": "session_id",
          "groupBy": "user_agent.browser.name",
          "timeframe": "this_14_days",
          "interval": "daily"
        }
      },
      raw: [
        {"value":[{"user_agent.browser.name":"Android Browser","result":0},{"user_agent.browser.name":"Chrome","result":32},{"user_agent.browser.name":"Firefox","result":12},{"user_agent.browser.name":"IE","result":1},{"user_agent.browser.name":"Mobile Safari","result":7},{"user_agent.browser.name":"Safari","result":4},{"user_agent.browser.name":"WebKit","result":0}],"timeframe":{"start":"2015-06-10T04:00:00.000Z","end":"2015-06-11T04:00:00.000Z"}},
        {"value":[{"user_agent.browser.name":"Android Browser","result":1},{"user_agent.browser.name":"Chrome","result":37},{"user_agent.browser.name":"Firefox","result":12},{"user_agent.browser.name":"IE","result":1},{"user_agent.browser.name":"Mobile Safari","result":21},{"user_agent.browser.name":"Safari","result":7},{"user_agent.browser.name":"WebKit","result":2}],"timeframe":{"start":"2015-06-11T04:00:00.000Z","end":"2015-06-12T04:00:00.000Z"}},
        {"value":[{"user_agent.browser.name":"Android Browser","result":0},{"user_agent.browser.name":"Chrome","result":28},{"user_agent.browser.name":"Firefox","result":13},{"user_agent.browser.name":"IE","result":0},{"user_agent.browser.name":"Mobile Safari","result":16},{"user_agent.browser.name":"Safari","result":8},{"user_agent.browser.name":"WebKit","result":0}],"timeframe":{"start":"2015-06-12T04:00:00.000Z","end":"2015-06-13T04:00:00.000Z"}},
        {"value":[{"user_agent.browser.name":"Android Browser","result":0},{"user_agent.browser.name":"Chrome","result":16},{"user_agent.browser.name":"Firefox","result":7},{"user_agent.browser.name":"IE","result":0},{"user_agent.browser.name":"Mobile Safari","result":10},{"user_agent.browser.name":"Safari","result":11},{"user_agent.browser.name":"WebKit","result":0}],"timeframe":{"start":"2015-06-13T04:00:00.000Z","end":"2015-06-14T04:00:00.000Z"}},
        {"value":[{"user_agent.browser.name":"Android Browser","result":0},{"user_agent.browser.name":"Chrome","result":28},{"user_agent.browser.name":"Firefox","result":15},{"user_agent.browser.name":"IE","result":0},{"user_agent.browser.name":"Mobile Safari","result":11},{"user_agent.browser.name":"Safari","result":10},{"user_agent.browser.name":"WebKit","result":1}],"timeframe":{"start":"2015-06-14T04:00:00.000Z","end":"2015-06-15T04:00:00.000Z"}},
        {"value":[{"user_agent.browser.name":"Android Browser","result":0},{"user_agent.browser.name":"Chrome","result":26},{"user_agent.browser.name":"Firefox","result":12},{"user_agent.browser.name":"IE","result":1},{"user_agent.browser.name":"Mobile Safari","result":9},{"user_agent.browser.name":"Safari","result":5},{"user_agent.browser.name":"WebKit","result":0}],"timeframe":{"start":"2015-06-15T04:00:00.000Z","end":"2015-06-16T04:00:00.000Z"}},
        {"value":[{"user_agent.browser.name":"Android Browser","result":0},{"user_agent.browser.name":"Chrome","result":25},{"user_agent.browser.name":"Firefox","result":8},{"user_agent.browser.name":"IE","result":1},{"user_agent.browser.name":"Mobile Safari","result":4},{"user_agent.browser.name":"Safari","result":5},{"user_agent.browser.name":"WebKit","result":0}],"timeframe":{"start":"2015-06-16T04:00:00.000Z","end":"2015-06-17T04:00:00.000Z"}},
        {"value":[{"user_agent.browser.name":"Android Browser","result":0},{"user_agent.browser.name":"Chrome","result":32},{"user_agent.browser.name":"Firefox","result":12},{"user_agent.browser.name":"IE","result":1},{"user_agent.browser.name":"Mobile Safari","result":7},{"user_agent.browser.name":"Safari","result":4},{"user_agent.browser.name":"WebKit","result":0}],"timeframe":{"start":"2015-06-17T04:00:00.000Z","end":"2015-06-18T04:00:00.000Z"}},
        {"value":[{"user_agent.browser.name":"Android Browser","result":1},{"user_agent.browser.name":"Chrome","result":37},{"user_agent.browser.name":"Firefox","result":12},{"user_agent.browser.name":"IE","result":1},{"user_agent.browser.name":"Mobile Safari","result":21},{"user_agent.browser.name":"Safari","result":7},{"user_agent.browser.name":"WebKit","result":2}],"timeframe":{"start":"2015-06-18T04:00:00.000Z","end":"2015-06-19T04:00:00.000Z"}},
        {"value":[{"user_agent.browser.name":"Android Browser","result":0},{"user_agent.browser.name":"Chrome","result":28},{"user_agent.browser.name":"Firefox","result":13},{"user_agent.browser.name":"IE","result":0},{"user_agent.browser.name":"Mobile Safari","result":16},{"user_agent.browser.name":"Safari","result":8},{"user_agent.browser.name":"WebKit","result":0}],"timeframe":{"start":"2015-06-19T04:00:00.000Z","end":"2015-06-20T04:00:00.000Z"}},
        {"value":[{"user_agent.browser.name":"Android Browser","result":0},{"user_agent.browser.name":"Chrome","result":16},{"user_agent.browser.name":"Firefox","result":7},{"user_agent.browser.name":"IE","result":0},{"user_agent.browser.name":"Mobile Safari","result":10},{"user_agent.browser.name":"Safari","result":11},{"user_agent.browser.name":"WebKit","result":0}],"timeframe":{"start":"2015-06-20T04:00:00.000Z","end":"2015-06-21T04:00:00.000Z"}},
        {"value":[{"user_agent.browser.name":"Android Browser","result":0},{"user_agent.browser.name":"Chrome","result":28},{"user_agent.browser.name":"Firefox","result":15},{"user_agent.browser.name":"IE","result":0},{"user_agent.browser.name":"Mobile Safari","result":11},{"user_agent.browser.name":"Safari","result":10},{"user_agent.browser.name":"WebKit","result":1}],"timeframe":{"start":"2015-06-21T04:00:00.000Z","end":"2015-06-22T04:00:00.000Z"}},
        {"value":[{"user_agent.browser.name":"Android Browser","result":0},{"user_agent.browser.name":"Chrome","result":26},{"user_agent.browser.name":"Firefox","result":12},{"user_agent.browser.name":"IE","result":1},{"user_agent.browser.name":"Mobile Safari","result":9},{"user_agent.browser.name":"Safari","result":5},{"user_agent.browser.name":"WebKit","result":0}],"timeframe":{"start":"2015-06-22T04:00:00.000Z","end":"2015-06-23T04:00:00.000Z"}},
        {"value":[{"user_agent.browser.name":"Android Browser","result":0},{"user_agent.browser.name":"Chrome","result":25},{"user_agent.browser.name":"Firefox","result":8},{"user_agent.browser.name":"IE","result":1},{"user_agent.browser.name":"Mobile Safari","result":4},{"user_agent.browser.name":"Safari","result":5},{"user_agent.browser.name":"WebKit","result":0}],"timeframe":{"start":"2015-06-23T04:00:00.000Z","end":"2015-06-24T04:00:00.000Z"}}
      ]      
    }
  };
};

export default fixture;
