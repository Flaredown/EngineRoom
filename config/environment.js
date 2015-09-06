/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: "engine-room",
    environment: environment,
    baseURL: "/",
    locationType: "auto",
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },
    contentSecurityPolicy: {
      "default-src": "*",
      "script-src": "*",
      "font-src": "*",
      "connect-src": "*",
      "img-src": "*",
      "style-src": "*",
      "frame-src": "*"
    },
    // contentSecurityPolicy: {
    //   'default-src': "'self'",
    //   'script-src': "'self' 'unsafe-inline' 'unsafe-eval' http://*.pusher.com www.google-analytics.com/analytics.js https://*.intercom.io https://*.intercomcdn.com www.google.com/jsapi d26b395fwzu5fz.cloudfront.net api.keen.io cdn.ravenjs.com www.telize.com",
    //   'font-src': "'self'",
    //   'connect-src': "`self` http://localhost:* ws://*.pusherapp.com http://*.pusher.com wss://*.intercom.io https://*.intercom.io ",
    //   'img-src': "'self' www.google-analytics.com data: app.getsentry.com https://*.intercomcdn.com",
    //   'style-src': "'self' 'unsafe-inline'",
    //   'frame-src': ""
    // },

    KPI: {
      "visits": {
        "filters": {
          "baseTimeframe": {
            "start": "2015-05-20T00:00:00.000Z"
          }
        },
        "metrics": [
          {
            "chartType": "stackedArea",
            "dataSource": "keen",
            "queryType": "count_unique",
            "queryParams": {
              "eventCollection": "pageviews",
              "targetProperty": "session_id",
              "groupBy": "user_agent.browser.name",
              "interval": "daily"
            },
            "order": 0
          },
          {
            "chartType": "ring",
            "dataSource": "keen",
            "queryType": "count_unique",
            "queryParams": {
              "eventCollection": "pageviews",
              "targetProperty": "session_id",
              "groupBy": "user_agent.browser.name",
              "interval": "daily"
            },
            "order": 1
          },
          {
            "chartType": "ring",
            "dataSource": "keen",
            "queryType": "count_unique",
            "queryParams": {
              "eventCollection": "pageviews",
              "targetProperty": "session_id",
              "groupBy": "user_agent.os.name",
              "interval": "daily"
            },
            "order": 2
          },
          {
            "chartType": "bar",
            "dataSource": "keen",
            "queryType": "count_unique",
            "queryParams": {
              "eventCollection": "pageviews",
              "targetProperty": "session_id",
              "groupBy": "user.current_location.country",
              "interval": "daily"
            },
            "order": 3
          }
        ]
      },
      "entries": {
        "filters": {
          "baseTimeframe": {
            "start": "2015-05-20T00:00:00.000Z"
          }
        },
        "metrics": [
          {
            "chartType": "line",
            "dataSource": "keen",
            "queryType": "count_unique",
            "queryParams": {
              "eventCollection": "entries",
              "targetProperty": "user_id",
              "interval": "daily"
            },
            "order": 0
          },
          {
            "chartType": "histogram",
            "dataSource": "keen",
            "queryType": "count_unique",
            "queryParams": {
              "eventCollection": "entries",
              "targetProperty": "keen.id",
              "groupBy": "local_time_hour",
              "interval": "daily"
            },
            "order": 1
          },
          {
            "chartType": "histogram",
            "dataSource": "keen",
            "queryType": "count_unique",
            "queryParams": {
              "eventCollection": "entries",
              "targetProperty": "keen.id",
              "groupBy": "day_of_week",
              "interval": "daily"
            },
            "order": 2
          }
        ]
      },
      "engagement": {
        "filters": {
          // baseTimeframe is underspecified for end: must be filled by the KPI with Time.now()
          "baseTimeframe": {
            "start": "2015-05-20T00:00:00.000Z"
          }
        },
        "metrics": [
          {
            "chartType": "histogram",
            "dataSource": "keen",
            "queryType": "count_unique",
            "queryParams": {
              "eventCollection": "entries",
              "targetProperty": "user_id",
              "groupBy": "n_conditions",
              "interval": "daily"
            },
            "order": 0
          },
          {
            "chartType": "line",
            "dataSource": "keen",
            "queryType": "count_unique",
            "queryParams": {
              "eventCollection": "entries",
              "targetProperty": "user_id",
              "interval": "daily"
            },
            "order": 1
          },
          {
            "chartType": "bar",
            "dataSource": "keen",
            "queryType": "count_unique",
            "queryParams": {
              "eventCollection": "conditions",
              "targetProperty": "user_id",
              "groupBy": "name",
              "interval": "daily"
            },
            "order": 2
          },
          {
            "chartType": "stackedArea",
            "dataSource": "keen",
            "queryType": "count_unique",
            "queryParams": {
              "eventCollection": "pageviews",
              "targetProperty": "session_id",
              "groupBy": "user_agent.browser.name",
              "interval": "daily"
            },
            "order": 3
          },
          {
            "chartType": "ring",
            "dataSource": "keen",
            "queryType": "count_unique",
            "queryParams": {
              "eventCollection": "pageviews",
              "targetProperty": "session_id",
              "groupBy": "user_agent.browser.name",
              "interval": "daily"
            },
            "order": 4
          }
        ]
      },
      "symptoms": {
        "filters": {
          // baseTimeframe is underspecified for end: must be filled by the KPI with Time.now()
          "baseTimeframe": {
            "start": "2015-05-20T00:00:00.000Z"
          }
        },
        "metrics": [
          {
            "chartType": "histogram",
            "dataSource": "keen",
            "queryType": "count_unique",
            "queryParams": {
              "eventCollection": "entries",
              "targetProperty": "user_id",
              "groupBy": "n_symptoms",
              "interval": "daily"
            },
            "order": 0
          },
          {
            "chartType": "bar",
            "dataSource": "keen",
            "queryType": "count_unique",
            "queryParams": {
              "eventCollection": "symptoms",
              "targetProperty": "user_id",
              "groupBy": "name",
              "interval": "daily"
            },
            "order": 1
          }
        ]
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  if (environment === "development") {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === "test") {
    // Testem prefers this...
    ENV.baseURL = "/";
    ENV.locationType = "none";

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = "#ember-testing";
  }

  if (environment === "production") {

  }

  return ENV;
};
