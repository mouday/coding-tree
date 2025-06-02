# sqlite

示例

```cpp
// main.c
#include <stdio.h>
#include <sqlite3.h>

static int callback(void *NotUsed, int argc, char **argv, char **azColName) {
    int i;
    for (i = 0; i < argc; i++) {
        printf("%s = %s\n", azColName[i], argv[i] ? argv[i] : "NULL");
    }
    printf("\n");
    return 0;
}

int main(int argc, char **argv) {
    sqlite3 *db;
    char *zErrMsg = 0;
    int rc;
    const char *sql;

    // 连接数据库
    rc = sqlite3_open("test.db", &db);
    if (rc) {
        fprintf(stderr, "Can't open database: %s\n", sqlite3_errmsg(db));
        sqlite3_close(db);
        return (1);
    } else {
        fprintf(stdout, "Opened database successfully\n");
    }

    // ddl
    sql = "drop table if exists t1";

    rc = sqlite3_exec(db, sql, callback, 0, &zErrMsg);
    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", zErrMsg);
        sqlite3_free(zErrMsg);
    } else {
        fprintf(stdout, "Table drop successfully\n");
    }

    // 创建表
    sql = "create table t1 (id int, name char(20))";

    rc = sqlite3_exec(db, sql, callback, 0, &zErrMsg);
    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", zErrMsg);
        sqlite3_free(zErrMsg);
    } else {
        fprintf(stdout, "Table create successfully\n");
    }

    // insert
    sql = "insert into t1 (id, name) values (1, 'Tom')";

    rc = sqlite3_exec(db, sql, callback, 0, &zErrMsg);
    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", zErrMsg);
        sqlite3_free(zErrMsg);
    } else {
        fprintf(stdout, "data insert successfully\n");
    }

    // SELECT 操作
    sql = "select * from t1";

    rc = sqlite3_exec(db, sql, callback, 0, &zErrMsg);
    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", zErrMsg);
        sqlite3_free(zErrMsg);
    }else {
        fprintf(stdout, "data select successfully\n");
    }

    sqlite3_close(db);

    return 0;
}
```

编译执行

```shell
gcc -lsqlite3 main.c && ./a.out
```

参考

https://www.runoob.com/sqlite/sqlite-c-cpp.html
