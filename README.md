# Kubernetes Set Image

A compact way of doing deployments on a Kubernetes cluster.

Translates a list of deployments, containers and images into kubectl commands. Groups deployments into one command if possible. Waits until all rollout is complete.

It assumes that your deployments are already set up and does not support creating or editing YAML files. There is some error handling and testing, but in the end; it's purpose is solely to create `kubectl` run-lines.

**NOTICE: Use of this action is at your own risk. Use the `dry-run` input to see what commands will be run on your cluster before using this in production.**

## Requirements

- `kubectl` set up and working on your job.

## Inputs

### `namespace` (required)

A Kubernetes namespace to run on. I recommend adding this to an ENV variable and reference it like `{{ env.K8S_NAMESPACE }}`.

### `images` (required)

Images to set in the format of `deployment.<deployment-name>.<container-name>=<image-name>:<tag>`.

This action supports both a **single string**, or a **multi-line string** of images to set. See examples for more.

### `dry-run` (default: "false")

In case you want to see the commands instead of running them. This replaces `kubectl` with `echo kubectl` in the exec lines. Possible values: `"true"` or `"false"`.

### `wait` (default: "true")

This adds a command for each deployment to wait for rollout status. This is the default behavior as the action isn't really done, until the rollout is complete.

## Examples

### Multi-line example

Sets the backend and frontend image for a deployment called "example".

**workflow.yml**

```yaml
on: [push]

jobs:
  test:
    runs-on: ubuntu-latest
    name: Testing
    steps:
      - name: Test our action
        uses: andrioid/gh-action-k8s-set-image
        with:
          namespace: "default"
          images: |
            deployment.example.backend=gcr.io/example/backend:latest
            deployment.example.frontend=gcr.io/example/frontend:latest
```

Runs:

```
kubectl --namespace default set image deployment/example backend=gcr.io/example/backend:latest frontend=gcr.io/example/frontend:latest
kubectl --namespace default rollout status deployment/example
```

### Single line example

Sets the backend and frontend image for a deployment called "example".

**workflow.yml**

```yaml
on: [push]

jobs:
  test:
    runs-on: ubuntu-latest
    name: Testing
    steps:
      - name: Test our action
        uses: andrioid/gh-action-k8s-set-image
        with:
          namespace: "default"
          images: deployment.example.backend=gcr.io/example/backend:latest
```

Runs:

```
kubectl --namespace default set image deployment/example backend=gcr.io/example/backend:latest
kubectl --namespace default rollout status deployment/example
```
