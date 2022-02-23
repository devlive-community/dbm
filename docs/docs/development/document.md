---
template: overrides/main.html
---

This document describes how to contribute project documents to the repository

#### The preparatory work

---

- Start by [Fork](https://docs.github.com/en/get-started/quickstart/fork-a-repo) the project source code into your own repository

- Use the following command to clone the project source code locally

```bash
git clone https://github.com/<UserName>/dbm 
```

`UserName`: This is the GitHub username for the current Fork project, like mine **qianmoQ**,So the path is `github.com/qianmoQ/dbm`

#### Install dependencies

---

- Install the mkdocs tool

```bash
pip install mkdocs
```

!!! warning "Warning"

    Some devices may require Python and PIP installed!

- Go to the `docs` directory and install project dependencies

```bash
cd docs/

pip install -r requirements.txt
```

#### Local debugging

---

!!! info

    Documentation module local debugging is relatively simple. After completing the `install dependencies` section, start the local service using the following command

```bash
mkdocs serve
```

After running the command, information similar to the following is displayed:

```java
INFO     -  Building documentation...
INFO     -  The 'extra.alternate' configuration contains a 'link' option that should starts with './' in {'name': 'English', 'link': '/en/', 'lang': 'en'}
INFO     -  The 'extra.alternate' configuration contains a 'link' option that should starts with './' in {'name': 'Chinese (Simplified)', 'link': '/zh/',
            'lang': 'zh'}
WARNING  -  Language 'zh' is not supported by lunr.js, not setting it in the 'plugins.search.lang' option
INFO     -  Cleaning site directory
INFO     -  Translated navigation to en
INFO     -  Translated navigation to zh
INFO     -  Building en documentation
INFO     -  Building zh documentation
INFO     -  Documentation built in 1.71 seconds
INFO     -  [14:17:46] Serving on http://127.0.0.1:8000/
```

This marks the successful startup of the service. Open the browser to `http://127.0.0.1:8000/` to see the local site that has been published

#### contribute

---

!!! tip

    We recommend that your cloned code rebuild a branch based on the master for code submission<br/>
    Build a new branch command `git checkout -b <BranchName>`

- Document Contents

  `assets`: Resource files (images, files, etc.)

  `development`: Develop relevant documents

  `reference`: Software usage related documentation

  `release`: Release related documents

- Modify the `mkdocs.yml` configuration file and add the configuration under the `nav` entry

!!! tip

    For example, to contribute a test related document, the default file name is `test.md` and the file path is `docs/`

The modified configuration is as follows

```yaml
nav:
  ...
  - Test: docs/test.md
```

- Internationalization name configuration (we'll use the Chinese example), add the configuration under the `nav_translations` entry

```yaml
nav_translations:
  zh: # What is marked here is the internationalization configuration of the relevant document
    Test: Test
```

- Internationalization document

!!! note

    Internationalization documents simply need to add the internationalization abbreviation to the original file, such as our default `test.md`,The internationalization file in Chinese is `test.zh.md`

#### Submit code

---

Once the document is written, we use the `git push` command to submit the written file to a personal repository, and then submit a `Pull request` to the `develop` branch of the remote repository for administrator review. The merge will be automatically posted to the official site
