var fixture = function() {
  return {
    small: {
      specs: {
        "chartType": "bar",
        "queryType": "count_unique",
        "queryParams": {
          "eventCollection": "conditions",
          "targetProperty": "user_id",
          "groupBy": "name"
        }
      },
      processed: [
        {"name":"Thing 1","result":1},
        {"name":"Thing 2","result":1},
        {"name":"Thing 3","result":1},
        {"name":"Thing 4","result":3},
        {"name":"Thing 5","result":4},
        {"name":"Thing 6 with a hugely long name","result":5},
        {"name":"Thing 7","result":1}
      ]
    },
    large: {
      specs: {
        "chartType": "bar",
        "queryType": "count_unique",
        "queryParams": {
          "eventCollection": "conditions",
          "targetProperty": "user_id",
          "groupBy": "name"
        }
      },
      processed: [
        {"name":"Thing 1","result":1},
        {"name":"Thing 2","result":4},
        {"name":"Thing 3","result":2},
        {"name":"Thing 4","result":3},
        {"name":"Thing 5","result":4},
        {"name":"Thing 6","result":5},
        {"name":"Thing 7","result":1},
        {"name":"Thing 8","result":7},
        {"name":"Thing 9","result":4},
        {"name":"Thing 10","result":8},
        {"name":"Thing 11","result":3},
        {"name":"Thing 12","result":4},
        {"name":"Thing 13","result":5},
        {"name":"Thing 14","result":9}        
      ]
    }  
  };
};

export default fixture;
