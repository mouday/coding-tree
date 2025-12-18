# libpg_query

使用PostgreSQL解析方式，解析SQL字符串为解析树

[https://github.com/pganalyze/pg_query](https://github.com/pganalyze/pg_query)

## 使用示例

编译pg_query静态库

```shell
# 生成 libpg_query.a
make
```

解析示例

```cpp
// examples/demo.c
#include <pg_query.h>
#include <stdio.h>

int main() {
  PgQueryParseResult result;

  result = pg_query_parse("SELECT 100");

  printf("%s\n", result.parse_tree);

  pg_query_free_parse_result(result);

  return 0;
}
```

运行

```shell
gcc -I./ -L./ -lpg_query examples/demo.c && ./a.out > out.json
```

输出结果

```json
{
  "version": 170007,
  "stmts": [
    {
      "stmt": {
        "SelectStmt": {
          "targetList": [
            {
              "ResTarget": {
                "val": {
                  "A_Const": { "ival": { "ival": 100 }, "location": 7 }
                },
                "location": 7
              }
            }
          ],
          "limitOption": "LIMIT_OPTION_DEFAULT",
          "op": "SETOP_NONE"
        }
      }
    }
  ]
}
```
