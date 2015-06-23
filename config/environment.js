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
      "engagement": {
        "filters": {
          "timeframe": "this_28_days"
        },
        "metrics": [
          {
            "chartType": "histogram",
            "queryType": "count_unique",
            "queryParams": {
              "eventCollection": "entries",
              "targetProperty": "user_id",
              "groupBy": "n_conditions",
            }
          },
          {
            "chartType": "line",
            "queryType": "count_unique",
            "queryParams": {
              "eventCollection": "entries",
              "targetProperty": "user_id",
              "interval": "daily"
            }
          },
          {
            "chartType": "bar",
            "queryType": "count_unique",
            "queryParams": {
              "eventCollection": "conditions",
              "targetProperty": "user_id",
              "groupBy": "name",
            }
          },
          {
            "chartType": "stackedArea",
            "queryType": "count_unique",
            "queryParams": {
              "eventCollection": "pageviews",
              "targetProperty": "session_id",
              "groupBy": "user_agent.browser.name",
              "interval": "daily"
            },
          },
          {
            "chartType": "ring",
            "queryType": "count_unique",
            "queryParams": {
              "eventCollection": "pageviews",
              "targetProperty": "session_id",
              "groupBy": "user_agent.browser.name",
            }
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
