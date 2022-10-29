const shelper = require("../../_helpers/steps_helper");
const stepsHelper = new shelper(__dirname);
const metadata = stepsHelper.metadata;

/* test
 * **SUMMARY:** Hashicorp vault get integration
 * 
 * **PARAMETERS:**
 * @param 
 */
module.exports = async function (workflowId, stepName, step, log, callback) {
  // Validate parameters based on metadata
  var missing_params = stepsHelper.validate_params(step.parameters);
  if (missing_params.length > 0) {
    stepsHelper.setError(step, `${workflowId}@${stepName}: missing parameters ${missing_params}.`);
  } else {
    var options = {
      apiVersion: step.parameters.api_version,
      endpoint: step.parameters.url,
      token: step.parameters.token
    };
    
    // get new instance of the client
    var vault = require("node-vault")(options);
    await vault.read(step.parameters.path)
      .then(response => { 
        stepsHelper.setOutputs(step, response.data.data );
      })
      .catch(e => {
        stepsHelper.setError(step, `[${workflowId}] [${stepName}]: ${metadata.name}@${metadata.version}, unable to retreive secret. ${e}.`);
      });   
  }
  callback(step);
};
