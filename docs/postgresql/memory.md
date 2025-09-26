# PG源码学习

## memory

```cpp
int main(int argc, char *argv[])
{
    MemoryContextInit();

    PostmasterMain(argc, argv);
}

void MemoryContextInit(void)
{
    TopMemoryContext = AllocSetContextCreate(
        (MemoryContext) NULL,
        "TopMemoryContext",
        ALLOCSET_DEFAULT_SIZES);

    CurrentMemoryContext = TopMemoryContext;

    ErrorContext = AllocSetContextCreate(
        TopMemoryContext,
        "ErrorContext",
        8 * 1024,
        8 * 1024,
        8 * 1024);
}

void InitializeGUCOptions(void)
{
    build_guc_variables()
}

void build_guc_variables(void)
{
    GUCMemoryContext = AllocSetContextCreate(
        TopMemoryContext,
        "GUCMemoryContext",
        ALLOCSET_DEFAULT_SIZES);
}

void PostmasterMain(int argc, char *argv[]){
    PostmasterContext = AllocSetContextCreate(
        TopMemoryContext,
        "Postmaster",
        ALLOCSET_DEFAULT_SIZES);

    MemoryContextSwitchTo(PostmasterContext);

    InitializeGUCOptions();
}

PostgresMain(){
    MessageContext = AllocSetContextCreate(
        TopMemoryContext,
        "MessageContext",
        ALLOCSET_DEFAULT_SIZES);
}


```

## PostgreSQL进程

- Postmaster 守护进程：PostmasterMain：调度中心
- Postgres 服务进程：PostgresMain：处理查询
- 辅助进程
  - SysLogger：系统日志进程
  - PgStat
  - AutoVacuum
  - AutoVacLauncherMain
  - AutoVacWorkerMain
  - BackgroundWriter：后台写进程：定期将存放普通数据的共享缓冲区写入磁盘
  - WalWriter：预写日志写进程：定期将存放预写日志的WAL缓冲区写入磁盘
  - PgArchiver：预写日志归档进程：对WAL日志归档备份
  - BackgroundWorker

辅助进程启动流程：

```cpp
main()
{
    PostmasterMain()
    {
        // syslogger进程启动流程
        StartSysLogger() {
            SysLogger_Start() {
                postmaster_child_launch(B_LOGGER){
                    SysLoggerMain()
                }
            }
        }

        // BackgroundWriter
        StartChildProcess(B_BG_WRITER){
            postmaster_child_launch(B_BG_WRITER){
                BackgroundWriterMain()
            }
        }

        // bgworker进程启动流程
        maybe_start_bgworkers(){
            StartBackgroundWorker(){
                postmaster_child_launch(B_BG_WORKER){
                    BackgroundWorkerMain()
                }
            }
        }

        ServerLoop(){
            // AutoVacWorkerMain
            process_pm_pmsignal(){
                StartAutovacuumWorker(){
                    StartChildProcess(B_AUTOVAC_WORKER){
                        postmaster_child_launch(B_AUTOVAC_WORKER){
                            AutoVacWorkerMain()
                        }
                    }
                }
            }

            // BackendMain
            BackendStartup(){
                postmaster_child_launch(B_BACKEND){
                    BackendMain(){
                        PostgresMain()
                    }
                }
            }

            LaunchMissingBackgroundProcesses(){
                // WalWriterMain
                StartChildProcess(B_WAL_WRITER){
                    postmaster_child_launch(B_WAL_WRITER){
                        WalWriterMain()
                    }
                }
                // AutoVacLauncherMain
                StartChildProcess(B_AUTOVAC_LAUNCHER){
                    postmaster_child_launch(B_WAL_WRITER){
                        AutoVacLauncherMain()
                    }
                }
                // PgArchiverMain
                StartChildProcess(B_ARCHIVER){
                    postmaster_child_launch(B_ARCHIVER){
                        PgArchiverMain()
                    }
                }
            }
        }
    }
}
```

多用户模式参数：IsUnderPostmaster

```cpp
// src/backend/utils/init/globals.c
bool IsUnderPostmaster = false;

// src/backend/postmaster/launch_backend.c
postmaster_child_launch(){
    InitPostmasterChild(void){
        bool IsUnderPostmaster = true;
    }
}
```



## 系统表

- pg_namespace 命名空间
- pg_tablespace 表空间
- pg_database 数据库信息
- pg_type 数据类型
- pg_class 表对象信息
- pg_attribute 表属性信息
- pg_index 索引信息
- pg_statistic 统计信息

初始化过程

默认系统数据库

- template1 模板数据库，可修改
- template0 用于备份
- postgres 用于连接
