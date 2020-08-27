import * as core from "@actions/core";
import * as exec from "@actions/exec";

async function run(): Promise<void> {
  core.setCommandEcho(true);
  try {
    const namespace: string = core.getInput("namespace");
    const imageStr: string = core.getInput("images");
    const dryRun: boolean = core.getInput("dry-run") === "true";
    const wait: boolean = core.getInput("wait") === "true";
    core.info(`[k8s set-image] wait=${wait} dry-run=${dryRun}`);

    const lines = imageLinesToKubelines(imageStr, namespace, wait);
    const cmd = dryRun ? "echo kubectl" : "kubectl";
    for (let i = 0; i < lines.length; i++) {
      exec.exec(`${cmd} ${lines[i]}`);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

type DeploymentMap = {
  [key: string]: {
    deployment: string;
    resources: [
      {
        image: string;
        container: string;
      }
    ];
  };
};

export function imageLinesToKubelines(
  imageStr: string,
  namespace: string,
  wait: boolean
): string[] {
  const images = imageStr.split("\n");
  const kubeout: string[] = [];
  const deployments: DeploymentMap = {};
  for (let i = 0; i < images.length; i++) {
    const [where, to] = images[i].split("=");
    const whereSplit = where.split(".");
    const resource = whereSplit[0];
    if (resource !== "deployment") {
      throw new Error("Only deployment resources supported at this time.");
    }
    const deployment = whereSplit[1];
    const container = whereSplit[2];
    const image = to;

    const key = deployment;

    if (!deployments[key]) {
      deployments[key] = {
        deployment: resource,
        resources: [
          {
            container: container,
            image,
          },
        ],
      };
    } else {
      deployments[key].resources.push({
        container: container,
        image,
      });
    }
  }

  // Start by setting images
  for (let dep in deployments) {
    const resources = deployments[dep].resources;
    let resourceStr = "";
    for (let i = 0; i < resources.length; i++) {
      const res = resources[i];
      resourceStr += `${res.container}=${res.image}`;
      if (i < resources.length - 1) {
        resourceStr += " ";
      }
    }

    kubeout.push(
      `--namespace ${namespace} set image deployment/${dep} ${resourceStr}`
    );
  }

  if (wait) {
    for (let dep in deployments) {
      kubeout.push(`--namespace ${namespace} rollout status deployment/${dep}`);
    }
  }
  return kubeout;
}

run();
