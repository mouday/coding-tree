[返回目录](/blog/rabbitmq/index)

# RabbitMQ安装

https://hub.docker.com/_/rabbitmq

```bash
# 在线拉取
docker pull rabbitmq:3-management

# 从本地加载
docker load -i rabbitmq:3-management.tar
```


运行MQ容器：

```sh
docker run \
 -e RABBITMQ_DEFAULT_USER=root \
 -e RABBITMQ_DEFAULT_PASS=123456 \
 --name mq \
 --hostname mq1 \
 -p 15672:15672 \
 -p 5672:5672 \
 -d \
 rabbitmq:3-management
```
