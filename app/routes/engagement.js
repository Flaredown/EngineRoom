import Ember from "ember";
import KPI from "../routes/kpi";
import config from "../config/environment";

export default KPI.extend({

  config: config.KPI.engagement

});
