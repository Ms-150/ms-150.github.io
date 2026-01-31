# docker

Docker 是一个开源平台，旨在通过容器技术简化应用程序的开发、部署和运行。

[https://www.docker.com/](https://www.docker.com/)

## 基本概念

- 镜像 `images`
  一个轻量级、独立、可执行的软件包，包含运行应用程序所需的所有内容。镜像由一系列文件系统层组成，通过联合文件系统（UnionFS）叠加在一起，构成最终的镜像。

- 容器 `container`
  基于镜像启动的一个轻量级、独立的可运行环境。它们共享宿主操作系统的内核，但彼此隔离。容器是开发、测试和部署应用程序的核心单元。

- 仓库 `Docker Hub`
  一个公共仓库，用于存储和共享 Docker 镜像。你可以从 Docker Hub 拉取镜像，也可以将自己的镜像推送到 Docker Hub。

- 数据卷 `Docker Volumes`
  数据卷用于持久化和共享数据。它们允许你在容器之间共享数据，并将数据与容器的生命周期分离，以避免数据丢失。

- 自动化构建脚本 `Dockerfile`
  一个文本文件，包含了一系列指令，用于构建 Docker 镜像。

- 组合 `Docker Compose`
  用于定义和运行多容器 Docker 应用的工具。

- 集群 `Docker Swarm`
  用于管理容器集群的原生编排工具。它允许你将多台 Docker 主机集群化，作为一个单一的虚拟 Docker 主机来管理和部署容器。

```bash
docker
docker -v
docker --help
docker info     # 查看 docker 配置信息
```

## Image 镜象

镜像是一个轻量级、独立、可执行的软件包，包含运行应用程序所需的所有内容。
每个镜像由一系列文件系统层组成，这些层通过联合文件系统（UnionFS）叠加在一起，构成最终的镜像。

```bash
docker images    # 列出 镜像相关命令

docker search <镜像名>      # 搜索镜像
docker images ls           # 列出本地镜像
docker image pull <镜像名>:<标签>   # 拉取镜像
docker image rm <镜像名>:<标签>     # 删除镜像 容器用到了先删除容器

docker image history <镜像名>:<标签> # 查看镜像的构建历史（即镜像的每一层）
```

```bash
docker exec -it my_centos bash # 进去已运行的容器 bash
```

## Container 容器

基于镜像启动的一个轻量级、独立的可运行环境。但共享宿主操作系统的内核。容器是隔离的，但可以互相通信。

```bash
docker container    # 列出 容器相关命令

dcoker run -d --name <容器名> <镜像名>:<标签>   # 运行容器
docker run -d -p 80:80 --name nginx_my nginx

-d      # detached 分离 后台运行
-p 宿主机端口:容器端口      # 端口映射 宿主机:容器
--name  # 自定义容器名称
-it     # 交互模式运行容器并连接终端
-v      # 将宿主机卷挂载到容器内部

docker ps       # 列出正在运行的容器
docker ps -a    # 列出所有容器

docker stop <容器名/ID>     # 停止容器
docker restart <容器名/ID>  # 重新启动容器
docker rm <容器名/ID>       # 删除容器

docker logs <容器名/ID>     # 查看容器日志
```

## Volume 数据卷

- 持久化存储: 数据卷可以存储在主机文件系统中，不会随着容器的删除而丢失。
- 共享数据: 可以在多个容器之间共享同一个数据卷，实现数据共享。
- 分离数据和应用: 数据卷将数据从容器的文件系统中分离出来，使得数据可以独立于容器的生命周期进行管理。

```bash
docker volume   # 列出 数据卷相关命令

docker volume create <数据卷名>    # 创建卷

docker volume ls           # 列出卷
docker volume inspect      # 显示一个或多个卷的详细信息
docker volume prune        # 删除未使用的本地卷
docker volume rm           # 删除一个或多个卷
```

## Dockerfile

一个文本文件，包含了一系列指令，用来描述如何创建一个 Docker 镜像。通过 Dockerfile，可以自动化构建镜像的过程。

### 常用指令

```bash
FROM    # 指定基础镜像。每个 Dockerfile 都必须以 FROM 指令开始。
RUN     # 执行命令，在镜像中安装软件或配置环境。
COPY    # 将文件或目录从主机系统复制到镜像中。
ADD     # 除了复制文件外，还支持 URL 下载和 tar 文件自动解压。
CMD           # 指定容器启动时要运行的命令。
ENTRYPOINT    # 配置容器启动时执行的主程序。
WORKDIR       # 设置工作目录。
ENV           # 设置环境变量。
EXPOSE        # 声明容器将监听的端口。
VOLUME        # 声明一个挂载点，容器运行时将主机上的目录或数据卷挂载到这个位置。
```

### 构建自定义镜像

::: code-group

```bash [1. 准备环境]
mkdir my-ubuntu-web
cd my-ubuntu-web
vim Dockerfile   # 创建 Dockerfile 文件 （规定命名）
```

```Dockerfile [2. 编写 Dockerfile]
FROM ubuntu:24.04

# 设置环境变量，防止安装过程中弹出交互对话框
ENV DEBIAN_FRONTEND=noninteractive

# 更新源并安装 Nginx
# && 连接命令可以减少镜像层数
# 安装完后清理缓存，保持镜像“身材”
RUN apt-get update && 
    apt-get install -y nginx && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# 暴露 80 端口（告诉 Docker 这个容器监听 80）
EXPOSE 80

# 启动 Nginx
# -g "daemon off;" 意思是让 nginx 在前台运行
# 记住：Docker 容器需要一个前台进程才能保持运行，否则容器启动即退出
CMD ["nginx", "-g", "daemon off;"]
```

```bash [3. 构建与运行]
# -t 给你镜像起个名字，比如 my-web:v1
# . 代表当前目录（寻找 Dockerfile）
docker build -t my-web:v1 .
```

```bash [4. 测试]
打开浏览器访问：[http://localhost:8888](http://localhost:8888)
#  你应该能看到经典的 "Welcome to nginx!" 页面。
```
:::

### 镜像迁移 备份和恢复

将 Docker 镜像导出为一个 tar 包文件，以便在不同的环境之间迁移镜像。

```bash
docker save --help

# 备份
docker save -o /路径/镜像.tar 镜像名  # 将镜像名 保存为 /路径/镜像.tar

# 恢复
docker load -i /路径/镜像.tar
```

## Docker Hub

一个用于共享和管理 Docker 镜像的云端仓库，是 Docker 社区和开发者常用的资源库。你可以从 Docker Hub 中拉取公共镜像，也可以上传自己的镜像供他人使用。

### 镜像加速器配置

::: code-group

```bash
# Docker Desktop 配置地址
vim /Users/ms/.docker/daemon.json
```

```diff [daemon.json]
{
  "builder": {
    "gc": {
      "defaultKeepStorage": "20GB",
      "enabled": true
    }
  },
  "experimental": false,
+  "registry-mirrors": ["https://vsiidjop.mirror.aliyuncs.com"]
}
```

:::

### 推送镜像

```bash
docker login  # 登陆

docker tag 镜像名:标签名 用户名/镜像名:标签名  # 标记镜像
docker push 用户名/镜像名:标签名   # 上传

docker logout # 退出
# example
docker tag hello-world:latest 150337/hello-world-test:latest
docker push 150337/hello-world-test:latest
```

### 私有仓库搭建

Docker 提供了一个官方的 `Registry` 镜像，你可以通过以下命令启动一个私有仓库

::: code-group

```bash [1. 搭建]
docker pull registry

docker run -d -p 5555:5000 --name my-registry registry
# or 挂载数据卷
docker run -d -p 5555:5000 --name my_registry -v /var/lib/docker/registty:/var/lib/registry registry

# http://localhost:5555/v2/
```

```bash [2. 推送]
docker tag hello-world localhost:5555/hello
docker push localhost:5555/hello
```

```bash [3. 查看]
http://localhost:5555/v2/_catalog
```

```bash [4. 拉取]
docker run -it --name hello-5555 localhost:5555/hello
```

:::

#### 认证 授权

::: code-group

```bash [1. 创建证书存储目录]
mkdir -p /var/lib/docker/registry/certs   # 创建证书存储目录

openssl genrsa -out registry.ket 2048     # 生成私钥
openssl req -new -key ./registry.key -out registry.csr # 生成证书请求文件
>>>
Common Name (e.g. server FQDN or YOUR name) []:127.0.0.1  # 填写宿主机地址
```

```bash [2. 生成鉴权密码文件]
brew install httpd

htpasswd -Bbn root admin > /var/lib/docker/registry/auth/htpasswd # 鉴权密码文件
# -B 指定 bcrypt 加密算法来加密密码 默认 md5
# or
htpasswd -c /var/lib/docker/registry/auth/htpasswd root
```

```bash [3. 重新运行容器]
docker run -di -p 5555:5000 --name my_registry \
-v /var/lib/docker/registry:/var/lib/registry \
-v /var/lib/docker/registry/certs:/certs \
-v /var/lib/docker/registry/auth:/auth \
-e "REGISTRY_HTTP_TLS_CERTIFICATE=/certs/registry.crt" \
-e "REGISTRY_HTTP_TLS_KEY=/certs/registry.key" \
-e "REGISTRY_AUTH=htpasswd" \
-e "REGISTRY_AUTH_HTPASSWD_REALM=Registry Realm" \
-e "REGISTRY_AUTH_HTPASSWD_PATH=/auth/htpasswd" \
registry:latest
```

```bash [4. 推送]
docker tag hello-world 127.0.0.1:5555/hello   # tag
docker push 127.0.0.1:5555/hello              # push
>>>
Using default tag: latest
The push refers to repository [127.0.0.1:5555/hello]
ac28800ec8bb: Preparing
no basic auth credentials  # auth失败


docker login 127.0.0.1:5555   # 登陆
docker push 127.0.0.1:5555/hello  # push
docker logout 127.0.0.1:5555  # 退出
```

:::

## Network 网路

用于连接容器的基础设施。它可以让容器相互通信，或者与外部网络进行通信

```bash
docker network --help

docker network ls   # 显示网络列表
>>>
NETWORK ID     NAME      DRIVER    SCOPE
4db186d93eff   bridge    bridge    local
4237426a6372   host      host      local
924a0d5a5918   none      null      local

```

### 网络模式

- 默认类型
  | 类型   |                                                                                        | 备注 |
  | ------ | -------------------------------------------------------------------------------------- | ---- |
  | bridge | 每个容器连接到一个虚拟的内部桥接网络。容器可以通过容器名称或 IP 地址互相通信           | 默认 |
  | host   | 容器直接使用主机的网络栈，和主机共享网络命名空间。容器的 IP 地址和端口与主机完全相同。 |      |
  | none   | 容器没有连接到任何网络。                                                               |      |

```bash
docker --network host centos # 指定网络模式
```

- container 网络模式

允许一个容器共享另一个容器的网络栈。

```bash
docker run -di --name 容器名称1 busybox

docker run -di --name 容器名称2 --network container:容器名称1 busybox
```

- 自定义网络
  通过自定义网络，你可以更好地管理容器之间的通信，增强安全性，并配置特定的网络设置。

```bash
docker network create 自定义网络名    # 创建自定义网络
docker network ls   # 展示全部网络
docker network connect 自定义网络名 容器名      # 将容器连接到自定义网络
docker network disconnect 自定义网络名 容器名   # 将容器断开自定义网络
docker network rm 自定义网络名 # 删除自定义网络
docker network prune         # 修剪 删除未使用的自定义网络

docker network inspect 自定义网络名   # 检查自定义网络
```

## Compose 组成

用于定义和运行多容器 Docker 应用程序的工具。它使用一个 YAML 文件来配置应用程序的服务，然后使用一个简单的命令来创建和启动所有服务。

```bash
docker-compose --version

docker-compose up  # 创建并启动
docker-compose down # 停止 并移除容器和网络
```

### usage

::: code-group

```bash [1. 创建文件]
mkdir -p /var/lib/docker/docker-compose-nginx
cd /var/lib/docker/docker-compose-nginx

vi docker-compose.yml
```

```yml [2. docker-compose.yml]
version: '3'

services:
  nginx:
    image: nginx:latest
    container_name: custom_nginx
    networks:
      - custom_network
    ports:
      - "8080:80"

networks:
  custom_network:
    driver: bridge
```

```bash [3. 启动]
docker-compose up
```

```bash [4. 关闭]
docker-compose down
```

:::

## Swarm 集群

Docker 内置的容器编排工具，允许你管理和协调在多个主机上运行的容器，使它们像在单个主机上运行一样工作。

它将多个 Docker 主机聚合为一个虚拟的 Docker 主机，并自动调度容器的部署。

### 基本概念

1. Node 节点

- Manager Node（管理节点）: 负责集群的管理和调度任务。它们分发工作负载给 Worker Nodes，并维护集群的状态。
- Worker Node（工作节点）: 运行实际的容器工作负载，接收并执行从管理节点分发的任务。

```bash
docker swarm

docker swarm init   # 初始化集群
docker join         # 加入一个集群 作为 管理/工作 节点
```

2. Service（服务）
   服务定义了要在 Swarm 中运行的应用程序，可以扩展以在多个容器中运行
3. Task（任务）：
   是一个服务的具体实例，运行在某个节点上的容器。
4. Overlay Network（覆盖网络）：
   Swarm 模式下的网络，通过该网络，服务可以跨越不同的节点进行通信。
5. Swarm Cluster（集群）：
   由一个或多个节点组成的集群，它们协同工作以部署和管理容器。

### usage

1. 初始化集群

将当前节点设置为管理节点，并返回一个命令来加入其他节点。

```bash
docker swarm init   # 初始化集群
```

2. 加入工作节点

在其他 Docker 主机上，使用 `docker swarm init` 命令返回的 `token` 来加入 Swarm 集群：

```bash
docker swarm join --token <token> <manager-ip>:2377
```

3. 创建服务

在管理节点上，使用 `docker service create` 命令来部署服务：

```bash
docker service create --name my_web --replicas 3 -p 80:80 nginx
```

### 常用命令

```bash
docker service

docker service scale my_web=5   # 扩展服务
docker service ls       # 查看服务状态
docker service ps my_web  # 查看服务详细信息

docker service update --image nginx:latest my_web   # 更新服务
docker service rm my_web # 删除服务

docker swarm leave # 将工作节点从 Swarm 集群中移除，可以在该节点上运行
docker swarm leave --force # 最后删除 管理节点
```
