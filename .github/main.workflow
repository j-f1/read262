workflow "Run tests" {
  on = "push"
  resolves = [
    "Type Check",
    "Lint",
  ]
}

action "Install Dependencies" {
  uses = "docker://node:12"
  runs = ["sh", "-c", "yarn --ignore-scripts; yarn postinstall"]
}

action "Type Check" {
  uses = "CultureHQ/actions-yarn@master"
  needs = ["Install Dependencies"]
  args = ["tsc"]
}

action "Lint" {
  uses = "CultureHQ/actions-yarn@master"
  needs = ["Install Dependencies"]
  args = ["prettier", "--check"]
}
