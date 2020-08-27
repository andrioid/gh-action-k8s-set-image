## Kubernetes Set Image

workflow.yml

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
            deployment.example.backend=eu.gcr.io/example/awesome:latest
            deployment.example.frontend=eu.gcr.io/example/awesome:latest
            deployment.sidecart.sidecart=eu.gcr.io/example/awesome:latest
            deployment.sucky.*=eu.gcr.io/sucky:latest
```
