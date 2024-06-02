[返回目录](/blog/java/spring-boot/index.md)

# 7、打包与运行

```bash
# 打包
mvn package

# 运行项目
java -jar app.jar
```

## 问题1：测试代码全都执行了一遍

maven 默认打包package会执行一遍完整的生命周期，需要禁用test

## 问题2：app.jar 中没有主清单属性

```bash
# 默认打包结果
12K app.jar

# 使用打包插件 spring-boot-maven-plugin
30M app.jar
12K app.jar.original
```

Jar包描述文件 META-INF/MANIFEST.MF

不使用插件打包结果

```
Manifest-Version: 1.0
Implementation-Title: spring_03_ssmp
Implementation-Version: 1.0-SNAPSHOT
Build-Jdk-Spec: 1.8
Created-By: Maven JAR Plugin 3.2.2
```

使用插件 spring-boot-maven-plugin 打包结果

```
Manifest-Version: 1.0
Spring-Boot-Classpath-Index: BOOT-INF/classpath.idx
Implementation-Title: spring_03_ssmp
Implementation-Version: 1.0-SNAPSHOT
Spring-Boot-Layers-Index: BOOT-INF/layers.idx
Start-Class: com.demo.Application
Spring-Boot-Classes: BOOT-INF/classes/
Spring-Boot-Lib: BOOT-INF/lib/
Build-Jdk-Spec: 1.8
Spring-Boot-Version: 2.7.7
Created-By: Maven JAR Plugin 3.2.2
Main-Class: org.springframework.boot.loader.JarLauncher
```

完整插件配置

```xml
<build>
    <plugins>
        <!-- maven 打包时跳过测试 -->
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-surefire-plugin</artifactId>
            <configuration>
                <skipTests>true</skipTests>
            </configuration>
        </plugin>

        <!--打包为可执行jar-->
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
        </plugin>
    </plugins>
</build>
```

## 问题3：端口被占用

Windows端口被占用

```bash
# 查询端口
netstat -ano

# 查询指定端口
netstat -ano | findstr "端口号"

# 根据进程PID查询进程名称
tasklist | findstr "进程PID号"

# 根据PID杀死任务
taskkill /F /PID "进程PID号"

# 根据进程名称杀死任务
taskkill -f -t -im "进程名称"
```

Linux  端口被占用

```bash
# 查找占用端口的进程
lsof -i:<端口号>

# 杀死进程
kill -9 <PID>
```


## Linux  

ssh工具：FinalShell

```bash
# 启动
java -jar app.jar

# 后台启动
nohup java -jar app.jar > app.log 2>&1 &
```

```bash
# 查询进程PID
ps -ef | grep 'java -jar'

# 杀死进程
kill -9 <PID>
```