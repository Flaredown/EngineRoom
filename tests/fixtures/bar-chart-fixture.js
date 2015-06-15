var fixture = function() {
  return {
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
      {"name":"Thing 6","result":5},
      {"name":"Thing 7","result":1}
    ]
  };
};

export default fixture;
