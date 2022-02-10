---
template: overrides/main.html
---

### Submitting a patch

1. It's generally best to start by opening a new issue describing the bug or
   feature you're intending to fix.  Even if you think it's relatively minor,
   it's helpful to know what people are working on.  Mention in the initial
   issue that you are planning to work on that bug or feature so that it can
   be assigned to you.

2. Follow the normal process of [forking](https://help.github.com/articles/fork-a-repo) the project, and set up a new
   branch to work in.  It's important that each group of changes be done in
   separate branches in order to ensure that a pull request only includes the
   commits related to that bug or feature.

3. Any significant changes should almost always be accompanied by tests.  The
   project already has good test coverage, so look at some existing
   tests if you're unsure how to go about it.

4. All contributions must be licensed Apache 2.0 and all files must have
   a copy of the boilerplate licence comment (can be copied from an existing
   file).

5. Do your best to have well-formed commit messages for each change.
   This provides consistency throughout the project, and ensures that commit
   messages are able to be formatted properly by various git tools.

6. Finally, push the commits to your fork and submit a [pull request](https://github.com/EdurtIO/incubator-dbm/pulls).

### Submitting documentation

The writing path of the document is in the `docs/` directory. Copy a file in any subdirectory to modify it.

The document is built using the Jekyll service. You need to install the dependency information through the following command:

```bash
bundle install jekyll
```

Installation project dependencies(You need to enter the `docs` directory to execute)

```bash
bundle install
```

Start service

```bash
bundle exec jekyll serve
```

or

```bash
jekyll s
```

Open browser to access `http://localhost:4000` You can see the content of the document
