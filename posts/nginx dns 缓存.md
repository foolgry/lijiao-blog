

### 注意：本篇文章是转载，原文链接https://zhuanlan.zhihu.com/p/28136665


之前的文章里提到，由于Unicorn自身的设计定位，导致Unicorn不建议直接面向客户端收发请求。按照Unicorn的推荐，建议在其前端加上nginx作为客户端请求的反向代理器。由于我们的所有服务都运行在Docker集群中。于是便顺利成章的有了下面的配置流程：

1.  首先在docker中创建一个自定义overlay网络，以便于nginx找到后端的服务。
2.  其次，创建一个运行unicorn的服务，并加入到第1步中创建的overlay网络。由于该服务并不直接对外提供服务，因此不需要publish端口。这里假定该服务name为backend，unicorn在里面监听3000端口。
3.  最后创建一个运行nginx的服务，也加入第1步创建的overlay网络。并将该服务里nginx监听的80端口对外publish。并设置nginx的配置如下：

```nginx
server {
	listen 80 default_server;
	location / {
		proxy_pass http://backend:3000;
		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
		proxy_set_header Host $http_host;
	}
}
```

一开始，启动两个服务后，通过nginx来访问unicorn，没有什么问题。但是当服务部署多了之后就会发现问题。在单独更新backend服务而不更新nginx，或者nginx更新时backend还没更新完成时，会发生两种奇怪的现象：

1.  通过nginx代理访问unicorn服务，会出现后端不可达的5XX错误，比如502。
2.  通过nginx代理访问unicorn服务，会出现串访的情况。这种情况更让人摸不着头脑。

什么叫“串访”呢？比如，启动100个nginx服务frontend1～frontend100，分别作为后端unicorn服务backend1～backend100的反响代理。正常情况下，访问frontendN得到的就是backendN的响应。但实际上会出现，访问frontendN得到backendM的结果。

当然从现在我解决了问题后，开了上帝视角说起来很简单。但当时出现这种情况时，排查和定位过程很繁杂，也没有什么头绪。感觉就像是撞鬼了一样。那么从结果来看，看看我们如何确认问题的。在出现问题后：

1.  首先，我们让原本不对外publish端口的backend服务全部对外publish。然后直接访问backend服务publish的端口。这样可以从源头上检查backend服务本身有没有问题。结果发现**可以正常访问，不会出现串访**。
2.  其次，我们进入到nginx容器内，手动访问proxy\_pass指定的后端服务。这样我们可以检查docker集群内，overlay网络中nginx和backend服务通信之间有没有问题。结果发现也**可以正常访问，不会出现串访**；
3.  再次，我们继续在nginx容器内，通过localhost手动访问nginx监听的80端口。这样可以检查nginx本身是否工作正常。结果**发现有问题**。
4.  最后，我们也顺带在客户端通过nginx服务publish的端口访问。结果**现象和第3步一样**，说明docker swarm的负载均衡器没有问题。

问题就确定在nginx自身了。

由于我们在nginx的proxy\_pass后端中指定后端时，是通过backendN这样的域名（别名）来访问的。根据经验，nginx最后肯定要解析成IP地址进行访问。那么会不会是这个地方的问题？于是我们通过以下步骤来验证（这也是简单的复现该问题的办法）：

1.  创建一个新的overlay网络，通过--ip-range参数配置网络中容器的IP段。比如：配置为192.168.0.0/29限制可用地址数量为6个。
2.  启动一个nginx服务frontend1，用于反向代理后端的backend1。
3.  启动多个replicas为1的unicorn服务backend1～backendN，数量足以覆盖绝大多数overlay的可用地址。
4.  测试访问frontend1，确保正常返回backend1的响应。
5.  在nginx容器中，通过nslookup tasks.backend1，检查后端的IP地址，并记录。
6.  尝试多次全部重启所有的unicorn容器。直到测试访问异常，最好是测试到串访的情况。比如正常返回结果应该是backend1，但是返回backendX。
7.  此时进入nginx容器，在通过nslookup tasks.backend1，检查后端的IP地址。会发现和前面第5步的IP地址（完全）不同。并且，此时通过docker network inspect检查我们创建的overlay网络。会发现，原来第5步的IP地址，这个时候被分配到backendX的服务容器上了。

问题验证结束。说明问题的根源是什么？根源就是nginx服务frontend1启动的时候，会缓存后端backend1的IP地址。此后就算是backend1的IP地址变了（通过第二次nslookup可以确认），但是nginx仍然熟视无睹。

通过Google搜索nginx dns cache，会发现Nginx的确是这么干的，而且干得很坑爹。我截取其中的内容（参考文档[DNS for Service Discovery with NGINX](https://link.zhihu.com/?target=https%3A//www.nginx.com/blog/dns-service-discovery-nginx-plus/)）如下：

```text
1. If the domain name can’t be resolved, NGINX fails to start or reload its configuration.
2. NGINX caches the DNS records until the next restart or configuration reload, ignoring the records’ TTL values.
3. We can’t specify another load‑balancing algorithm, nor can we configure passive health checks or other features defined by parameters to the server directive, which we’ll describe in the next section.

```

看到没有，Nginx大爷说了，在nginx启动的时候他就会去解析IP地址。解析完后就缓存起来，并且对解析结果的TTL不管不顾。坑了个大爹啊！

当然，这段文本说的通过proxy\_pass直接指定后端的方式。通过proxy\_pass指定后端组也是类似的。

而如果不想出现这种情况，而是每次都解析，那么Nginx也给出了办法，即使用变量设置proxy\_pass的后端，并且配合resolver指令设置DNS服务器。配置参考如下：

```nginx
server {
	...
	location / {
		resolver 8.8.8.8;
		set $backend http://backend1:3000;
		proxy_pass $backend;
	}
}
```

这个方案里，通过变量指定这个很容易。关键是通过resolver指定DNS服务器地址这个很坑爹。因为在单独的服务器，我们直接使用ISP或者DNS服务商的DNS服务器就可以了。但是docker overlay网络里，这个DNS服务器必须是docker内置的才行，并且没有对外提供服务。

好在Docker可能早就意识到这个问题了，把所有容器内的DNS服务器地址固定为127.0.0.11（参考文档：[Embedded DNS server in user-defined networks](https://link.zhihu.com/?target=https%3A//docs.docker.com/engine/userguide/networking/configure-dns/)）。所以，对应到我们这里，就可以把原来的nginx配置文件改为下面的格式：

```nginx
server {
	listen 80 default_server;
	location / {
		resolver 127.0.0.11;
		set $backend http://backend1:3000;
		proxy_pass $backend;
		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
		proxy_set_header Host $http_host;
	}
}
```

然后重复前面的验证过程，会发现问题就得到了解决。

参考文档：

*   [DNS for Service Discovery with NGINX](https://link.zhihu.com/?target=https%3A//www.nginx.com/blog/dns-service-discovery-nginx-plus/)
*   [Embedded DNS server in user-defined networks](https://link.zhihu.com/?target=https%3A//docs.docker.com/engine/userguide/networking/configure-dns/)