import Ember from "ember";
import KPI from "../mixins/kpi";
import config from "../config/environment";

export default Ember.Route.extend(KPI, {

  config: config.KPI.symptoms

});
