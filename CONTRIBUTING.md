# Contributing Guidelines

The following is a set of guidelines for contributing to NGINX Unit.  We do
appreciate that you are considering contributing!

## Table Of Contents

- [Ask a Question](#ask-a-question)
- [Contributing](#contributing)
- [Git Style Guide](#git-style-guide)

## Ask a Question

Please open an [issue](https://github.com/nginx/docker-extension/new) on GitHub with
the label `question`.  You can also ask a question on
[Slack](https://nginxcommunity.slack.com).


## Contributing

### Report a Bug

Ensure the bug was not already reported by searching on GitHub under
[Issues](https://github.com/nginx/docker-extension/issues).

If the bug is a potential security vulnerability, please report using our
[security policy](https://unit.nginx.org/troubleshooting/#getting-support).

To report a non-security bug, open an
[issue](https://github.com/nginx/unit/issues/new) on GitHub with the label
`bug`.  Be sure to include a title and clear description, as much relevant
information as possible, and a code sample or an executable test case showing
the expected behavior that doesn't occur.


### Suggest an Enhancement

To suggest an enhancement, open an
[issue](https://github.com/nginx/docker-extension/issues/new) on GitHub with the label
`enhancement`.  Please do this before implementing a new feature to discuss the
feature first.


### Open a Pull Request

Fork the repo, create a branch, and  submit a PR when your changes are tested and ready for review.
Again, if you'd like to implement a new feature, please consider creating a feature request
issue first to start a discussion about the feature.


## Git Style Guide

- Keep a clean, concise and meaningful `git commit` history on your branch,
  rebasing locally and squashing before submitting a PR

- In the subject line, use the past tense ("Added feature", not "Add feature");
  also, use past tense to describe past scenarios, and present tense for
  current behavior

- Limit the subject line to 67 characters, and the rest of the commit message
  to 80 characters
- 
- Reference issues and PRs liberally after the subject line; if the commit
  remedies a GitHub issue, [name
  it](https://docs.github.com/en/issues/tracking-your-work-with-issues/linking-a-pull-request-to-an-issue)
  accordingly

- Don't rely on command-line commit messages with `-m`; use the editor instead