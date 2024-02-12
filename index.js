const core = require("@actions/core");
const exec = require("child_process").exec;
const fs = require("fs");

try {
  downloadSfCli();
  installSfCli();
  authenticate();
} catch (error) {
  core.setFailed(error.message);
}

function downloadSfCli() {
  run("mkdir /tmp/sf");

  if (getVar("sf-cli-version")) {
    var version = getVar("sf-cli-version");
    run(
      `wget https://github.com/salesforcecli/cli/archive/refs/tags/${version}.tar.gz -q -P /tmp`
    );
    run(`tar xJf /tmp/sf-linux-x64.tar.xz -C /tmp/sf --strip-components 1`);
  } else {
    run(
      `wget https://developer.salesforce.com/media/salesforce-cli/sf/channels/stable/sf-linux-x64.tar.xz -q -P /tmp`
    );
    run("tar xJf /tmp/sf-linux-x64.tar.xz -C /tmp/sf --strip-components 1");
  }
}

function installSfCli() {
  run('echo "/tmp/sf/bin" >> $GITHUB_PATH');
  run("sf --version && sf plugins --core");
}

function authenticate() {
  if (getVar("auth-url")) {
    authenticateAuthUrl();
  } else if (
    getVar("jwt_username") &&
    getVar("jwt_client_id") &&
    (getVar("jwt_private_key") || getVar("jwt_private_key_base64_encoded"))
  ) {
    authenticateJwt();
  } else if (getVar("access_token") && getVar("access_token_url")) {
    authenticateAccessToken();
  }
}

function authenticateAuthUrl() {
  fs.writeFileSync("/tmp/sfdx_auth.txt", getVar("auth-url"));
  run(
    "sf org login sfdx-url --sfdx-url-file /tmp/sfdx_auth.txt --set-default-dev-hub --set-default"
  );
  run("rm -rf /tmp/sfdx_auth.txt");
}

function authenticateJwt() {
  var user = getVar("jwt_username");
  var client_id = getVar("jwt_client_id");
  var private_key;
  if (getVar("jwt_private_key")) {
    private_key = getVar("jwt_private_key");
  } else if (getVar("jwt_private_key_base64_encoded")) {
    var base64decoded = Buffer.from(
      getVar("jwt_private_key_base64_encoded"),
      "base64"
    );
    private_key = base64decoded;
  }

  run(
    `sf org login jwt --username ${user} --client-id ${client_id} --jwt-key-file ${private_key}`
  );
}

function authenticateAccessToken() {
  var token = getVar("access_token");
  var url = getVar("access_token_url");
  run(
    `echo ${token} | sf org login access-token --set-default-dev-hub --set-default --no-prompt --instance-url ${url}`
  );
}

/* ----------------------------- helper methods ----------------------------- */

function getVar(name) {
  return core.getInput(name);
}

function run(cmd) {
  exec(cmd, function (error, stdout, stderr) {
    if (error) throw stderr;
    core.info(stdout);
  });
}
