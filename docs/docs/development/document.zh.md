---
template: overrides/main.html
---

本文档主要讲解如何贡献项目文档到仓库中

#### 准备工作

---

- 首先将项目源码[Fork](https://docs.github.com/en/get-started/quickstart/fork-a-repo)为自己的仓库

- 使用以下命令克隆项目源代码到本地

```bash
git clone https://github.com/<UserName>/dbm 
```

`UserName`: 是指当前Fork项目的GitHub用户名, 比如我的是 **qianmoQ**,那么路径为`github.com/qianmoQ/dbm`

#### 安装依赖

---

- 安装mkdocs工具

```bash
pip install mkdocs
```

!!! warning "注意"

    部分设备可能需要安装Python以及pip相关软件!

- 进入`docs`目录,安装项目依赖

```bash
cd docs/

pip install -r requirements.txt
```

#### 本地调试

---

!!! info

    文档模块本地调试相对来说比较简单完成了`安装依赖`部分,使用以下命令启动本地服务

```bash
mkdocs serve
```

运行命令后会返回类似以下内容:

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

这标记着服务启动成功浏览器打开`http://127.0.0.1:8000/`即可看到已经发布的本地站点

#### 贡献内容

---

!!! tip

    我们建议您克隆下来的代码基于master重新构建一个分支用于代码的提交<br/>
    构建新分支命令`git checkout -b <BranchName>`

- 文档目录说明

  `assets`: 资源文件(图片,文件等)
  
  `development`: 开发相关文档
  
  `reference`: 软件使用相关文档
  
  `release`: 版本发布相关文档

- 修改`mkdocs.yml`配置文件,在`nav`条目下添加配置

!!! tip

    比如贡献一个测试相关的文档,默认文件名为`test.md`,文件路径为`docs/`

修改后的配置如下

```yaml
nav:
  ...
  - Test: docs/test.md
```

- 国际化名称配置(我们使用中文举例来说),在`nav_translations`条目下添加配置

```yaml
nav_translations:
  zh: # 这里标记的是相关文档的国际化配置
    Test: Test
```

- 国际化文档

!!! note

    国际化文档只需要将原有文件中添加国际化的简称即可,比如我们默认的是`test.md`,那中文的国际化文件为`test.zh.md`

#### 代码提交

---

文档编写完成后我们使用`git push`命令将书写后的文件提交到个人仓库中,然后提交一个`Pull requests`到远程仓库的`develop`分支等待管理员审核合并后将会自动发布到官方站点
