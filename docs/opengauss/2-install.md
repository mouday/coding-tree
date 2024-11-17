# 安装OpenGauss

下载软件包
https://opengauss.org/zh/download/


![](https://mouday.github.io/img/2024/11/15/qq8kmsv.png)

https://docs.opengauss.org/zh/docs/6.0.0/docs/InstallationGuide/单节点安装.html

信号量内核参数

处理报错“the maximum number of SEMMNI is not correct, the current SEMMNI is xxx. Please check it.”

```bash
cat /proc/sys/kernel/sem

sysctl -w kernel.sem="250 85000 250 330" 
```

参考

linux部署opengauss
https://blog.csdn.net/qq_67296375/article/details/142693291


kernel.sem 参数设置
https://blog.csdn.net/heizistudio/article/details/72828319