2022-10-21
#maven 

## maven 快照 snapshot

属于 Java 包版本管理的范畴
主要解决依赖包频繁发布新版本，需要改动项目 pom 依赖的问题

具体的可以看这篇文章
https://www.runoob.com/maven/maven-snapshots.html

> 一个大型的软件应用通常包含多个模块，并且通常的场景是多个团队开发同一应用的不同模块。举个例子，设想一个团队开发应用的前端，项目为 app-ui(app-ui.jar:1.0)，而另一个团队开发应用的后台，使用的项目是 data-service(data-service.jar:1.0)。

> 现在可能出现的情况是开发 data-service 的团队正在进行快节奏的 bug 修复或者项目改进，并且他们几乎每隔一天就要发布库到远程仓库。 现在如果 data-service 团队每隔一天上传一个新版本，那么将会出现下面的问题：

> -   data-service 团队每次发布更新的代码时都要告知 app-ui 团队。
> -   app-ui 团队需要经常地更新他们 pom.xml 文件到最新版本。

> 为了解决这种情况，**快照**的概念派上了用场。