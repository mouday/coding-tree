### 防火墙

```bash
# 查看防火墙状态
systemctl status firewalld
firewall-cmd --state

# 暂时关闭防火墙
systemctl stop firewalld

# 永久关闭防火墙
systemctl disable firewalld

# 开启防火墙
systemctl start firewalld

# 开放指定端口
firewall-cmd --zone=public --add-port=8080/tcp --permanent

# 关闭指定端口
firewall-cmd --zone=public --remove-port=8080/tcp --permanent

# 立即生效
firewall-cmd --reload

# 查看开放端口
firewall-cmd --zone=public --list-ports
```

注意：

- `systemctl` 是管理Linux服务的命令，可以进行启动、停止、重启、查看状态等操作
- `firewall-cmd` 是Linux中专门用于控制防火墙的命令
- 为了保证系统安全，不建议关闭防火墙

