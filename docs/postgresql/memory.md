# memory

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
```


PostgreSQL进程：

- 守护进程 Postmaster
- 服务进程 Postgres
- 辅助进程
  - SysLogger：系统日志进程
  - PgStat
  - AutoVacuum
  - BackgroundWriter：后台写进程：定期将存放普通数据的共享缓冲区写入磁盘
  - WalWriter：预写日志写进程：定期将存放预写日志的WAL缓冲区写入磁盘
  - PgArchiver：预写日志归档进程：对WAL日志归档备份
  - BackgroundWorker

辅助进程启动流程：

```cpp
main
    ->PostmasterMain
        // syslogger进程启动流程
        -> StartSysLogger
            -> SysLogger_Start
                -> postmaster_child_launch(B_LOGGER)
                    -> SysLoggerMain

        // BackgroundWriter
        StartChildProcess(B_BG_WRITER);
            -> postmaster_child_launch(B_BG_WRITER)
                -> BackgroundWriterMain

        // bgworker进程启动流程
        -> maybe_start_bgworkers
            -> StartBackgroundWorker
                -> postmaster_child_launch(B_BG_WORKER)
                    -> BackgroundWorkerMain

        -> ServerLoop
            -> LaunchMissingBackgroundProcesses
                // WalWriterMain
                -> StartChildProcess(B_WAL_WRITER)
                    -> postmaster_child_launch(B_WAL_WRITER)
                        -> WalWriterMain

                // PgArchiverMain
                -> StartChildProcess(B_ARCHIVER)
                    -> postmaster_child_launch(B_ARCHIVER)
                        -> PgArchiverMain
```
