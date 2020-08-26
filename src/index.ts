import * as core from "@actions/core";
import * as exec from "@actions/exec";

async function run(): Promise<void> {
  core.setCommandEcho(true);
  try {
    const namespace: string = core.getInput("namespace");
    const imageStr: string = core.getInput("images");
    core.info(`Namespace: '${namespace}' imageStr: '${imageStr}'`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
