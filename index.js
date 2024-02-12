const core = require("@actions/core");
const exec = require("child_process").exec;
const fs = require("fs");

try {
  downloadSfCli();
  installSfCli();
  authenticateDevhub();
} catch (error) {
  core.setFailed(error.message);
}

function downloadSfCli() {
  run("mkdir /tmp/sf");

  if (core.getInput("sf-cli-version")) {
    var version = core.getInput("sf-cli-version");
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
  run("/tmp/sf/bin/sf --version && /tmp/sf/bin/sf plugins --core");
}

function authenticateDevhub() {
  if (core.getInput("sfdx-auth-url")) {
    fs.writeFileSync("/tmp/sfdx_auth.txt", core.getInput("sfdx-auth-url"));
    run(
      "/tmp/sf/bin/sf auth sfdxurl store --sfdx-url-file /tmp/sfdx_auth.txt --set-default-dev-hub --set-default --alias SFDX-ENV"
    );
    run("rm -rf /tmp/sfdx_auth.txt");
  }
}

/* ----------------------------- helper methods ----------------------------- */

function run(cmd) {
  exec(cmd, function (error, stdout, stderr) {
    if (error) throw stderr;
    core.info(stdout);
  });
}
