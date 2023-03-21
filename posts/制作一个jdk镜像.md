2022-11-20

#镜像 #jdk #运维 


1. 新建一个dockerfile
```
vim Dockerfile 
```

1. 内容如下

```
from openjdk:8-jdk-alpine

# 替换源，安装必要的工具
RUN sed -i "s/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g" /etc/apk/repositories \
      && apk update && apk add busybox curl vim
```

3. 构建镜像并推送

```
s docker build -t jdk:v2 .

s docker tag jdk:v2 tagxxx

s docker login -u xx -p xx url

docker push url

```