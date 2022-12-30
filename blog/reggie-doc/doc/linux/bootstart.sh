#!/usr/bin/bash

# 项目名
APP_NAME=demo-0.0.1-SNAPSHOT.jar

# 1、停止运行中的项目
tpid=`ps -ef | grep ${APP_NAME} | grep -v grep | grep -v 'kill' | awk '{print $2}'`

if [[ ${tpid} ]]; then
    kill -15 ${tpid}
fi

sleep 2

tpid=`ps -ef | grep ${APP_NAME} | grep -v grep | grep -v 'kill' | awk '{print $2}'`

if [[ ${tpid} ]]; then
    kill -9 ${tpid}
fi

# 2、拉取代码
cd /usr/local/helloworld
git pull

# 3、打包
output=`mvn clean package -Dmaven.test.skip=true`

# 4、启动
nohup java -jar target/${APP_NAME} &> hello.log &

echo "启动/重启完成"