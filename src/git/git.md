# Git

Git 是目前最先进的分布式版本控制系统。

[https://git-scm.com](https://git-scm.com)

- **集中式**：版本存放在中央服务器，每个人的电脑需要连接中央服务器，通过联网下载文件。
- **分布式**：没有中央服务器，每个人的电脑都是独立的，如果有需要，中央服务器仅作为交换使用。

## 配置 (`config`)

### 设置全局的用户名和邮箱

```bash
git config --global user.name "用户名"
git config --global user.email "邮箱地址"
```

### 查看当前用户（global）配置

```bash
git config --global -l
# or
git config --global -list
```

## 仓库基础操作

### 初始化仓库

将目录变成 Git 仓库：

```bash
git init  # 在终端窗口打开并运行
```

### 提交变更到仓库

```bash
git add -A                   # 提交所有变化到暂存区
git commit -m "文档说明"     # 提交到本地仓库并添加说明
git push                     # 提交到远程仓库
```

### 查看历史操作版本

```bash
git log                      # 显示完整日志
git log --oneline            # 显示简略日志
git log --pretty=oneline     # 显示简略日志的另一种方式
```

### 版本回退

```bash
git reset --hard HEAD^       # 回退到上一个版本，用 ^ 指定回退层数
git reset --hard commit_id   # 回退到指定的 commit_id
```

### 查看操作记录

```bash
git reflog  # 显示所有操作记录，用于版本回退
```

### 查看当前暂存区和版本库状态

```bash
git status  # 显示暂存区和版本库的状态
```

### 将暂存区的内容回退到工作区

```bash
git restore --staged <文件名>  # 将暂存区的内容撤回到工作区
```

### checkout 将工作区的内容回退到上一个版本

```bash
git checkout --<文件名>  # 放弃对文件的修改，恢复到上一个版本
```

### rm 删除版本库中的文件

```bash
git rm <文件名>            # 删除文件并提交删除操作到版本库
git commit -m "删除文件"  # 提交删除操作到版本库
```

```bash
git rm --cached <文件名>
# --cached 仅从 Git 仓库/暂存区中删除追踪记录，不会删除你本地硬盘上的 .env 文件。
```

::: warning
从 Git 索引中移除已经追踪的文件
仅仅修改 `.gitignore` 并不会使 Git 停止跟踪已经被添加到版本控制中的文件。
你需要使用 `git rm --cached` 命令从 Git 索引中移除这些文件，但文件本身仍然会保留在你的工作区。
如：git rm --cached .env
:::

## 远程仓库

### 查看 SSH 密钥

```bash
cd ~/.ssh  # 查看 SSH 密钥
```

### 生成 SSH 密钥

```bash
ssh-keygen -t rsa -C "邮箱地址"  # "" 中也可以是其他标识
# or
ssh-keygen -t rsa -C "iMac.local"
```

### 关联远程仓库（首次提交版本）

```bash
git remote add origin git@github.com:username/rep.git
```

### 删除与远程库的连接

```bash
git remote rm origin  # 修改或删除与远程库的连接
```

### 解决远程分支已有文件导致的错误

```bash
git pull origin master  # 解决 error: 远程 origin 已经存在 的问题
```

### 提交到远程库（下次直接上传的命令）

```bash
git push -u origin main  # main 是分支名称
```

### 从远程库克隆仓库

```bash
git clone <ssh地址>  # 克隆整个远程仓库
```

## 分支

### 查看分支

```bash
git branch  # 查看所有分支
```

### 创建并切换到新分支

```bash
git switch -c <分支名>    # 创建新分支并切换到该分支（推荐）
git checkout -b <分支名>  # 创建新分支并切换到该分支
```

### 切换分支

```bash
git checkout <分支名>  # 切换到指定分支
git switch <分支名>    # 切换到指定分支（推荐）
```

### 合并分支

```bash
git merge <分支名>  # 将指定分支合并到当前分支
```

### 删除分支

```bash
git branch -d <分支名>  # 删除指定分支
```

### 暂存变更

```bash
git stash        # 保存所有的修改，包括已追踪的
git stash -u     # 保存所有的修改，包括已追踪的和未追踪的文件
git pull         # 拉取远程更新
git stash pop    # 恢复暂存的变更

git pull --rebase --autostash  # 综合执行以上操作
```

### 将指定的提交（commit）应用于其他分支

```bash
git cherry-pick <HashA> <HashB>  # 应用多个 commit 到当前分支
```

### 图解 `cherry-pick`

```plaintext
 a - b - c - d    Master
         \
           e - f - g    Feature

git checkout master
git cherry-pick f

 a - b - c - d - f    Master
         \
           e - f - g    Feature
```

### 解决冲突

当多人修改分支内容导致冲突时，可以使用以下步骤：

```bash
git pull  # 拉取远程更新，解决冲突并上传
```

### `.gitignore` 配置忽略文件

```
dist/
deploy_versions/
.temp/
.rn_temp/
node_modules/
.DS_Store

.vscode/
.idea
```

## 压缩提交

```bash
git rebase -i HEAD~N
git rebase -i HEAD~<head>
```

### 清除 `.idea` 的 Git 缓存

```bash
git rm -r --cached .idea
```

### 初始化并链接远程仓库

```bash
echo "# init" >> README.md
git init
git add README.md
git commit -m "init"
git branch -M main
git remote add origin git@github.com:username/repo.git
git push -u origin main
```

### 切换用户

```bash
# 在 .git/config 中单独配置当前仓库的用户
git config user.name "user_gh"
git config user.email "user_gh@gmail.com"
```
