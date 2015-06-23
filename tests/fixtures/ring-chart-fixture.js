var fixture = function() {
  return {
    small: {
      specs: {
        "chartType": "ring",
        "queryType": "count_unique",
        "queryParams": {
          "eventCollection": "pageviews",
          "targetProperty": "session_id",
          "groupBy": "user_agent.browser.name"
        }
      },
      processed: [
        {"user_agent.browser.name":"Thing 1","result":1},
        {"user_agent.browser.name":"Thing 2","result":1},
        {"user_agent.browser.name":"Thing 3","result":1},
        {"user_agent.browser.name":"Thing 4","result":3},
        {"user_agent.browser.name":"Thing 5","result":4},
        {"user_agent.browser.name":"Thing 6 with a hugely long name","result":5},
        {"user_agent.browser.name":"Thing 7","result":1}
      ]
    },
    large: {
      specs: {
        "chartType": "ring",
        "queryType": "count_unique",
        "queryParams": {
          "eventCollection": "pageviews",
          "targetProperty": "session_id",
          "groupBy": "user_agent.browser.name"
        }
      },
      processed: [
        {"user_agent.browser.name":"Thing 1","result":1},
        {"user_agent.browser.name":"Thing 2","result":4},
        {"user_agent.browser.name":"Thing 3","result":2},
        {"user_agent.browser.name":"Thing 4","result":3},
        {"user_agent.browser.name":"Thing 5","result":4},
        {"user_agent.browser.name":"Thing 6","result":5},
        {"user_agent.browser.name":"Thing 7","result":1},
        {"user_agent.browser.name":"Thing 8","result":7},
        {"user_agent.browser.name":"Thing 9","result":4},
        {"user_agent.browser.name":"Thing 10","result":8},
        {"user_agent.browser.name":"Thing 11","result":3},
        {"user_agent.browser.name":"Thing 12","result":4},
        {"user_agent.browser.name":"Thing 13","result":5},
        {"user_agent.browser.name":"Thing 14","result":9}        
      ]
    }  
  };
};

export default fixture;
