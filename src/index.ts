import * as core from "@actions/core";
import * as exec from "@actions/exec";

async function run(): Promise<void> {
  core.setCommandEcho(true);
  try {
    const namespace: string = core.getInput("namespace");
    const imageStr: string = core.getInput("images");
    const images = imageStr.split("\n");
    core.info(`Namespace: '${namespace}'`);
    images.forEach((i) => {
      const [where, to] = i.split("=");
      core.info(`kubectl --namespace ${namespace} ${where} --set-image ${to}`);
    });
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
