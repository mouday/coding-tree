# libfort

用于在终端输出表格，提供了表格布局和样式设置的功能

[https://github.com/seleznevae/libfort](https://github.com/seleznevae/libfort)

示例: C示例

```cpp
#include <stdio.h>

#include "fort.h"

int main(void)
{
    ft_table_t *table = ft_create_table();

    /* Setup header */
    ft_set_cell_prop(table, 0, FT_ANY_COLUMN, FT_CPROP_ROW_TYPE, FT_ROW_HEADER);
    ft_write_ln(table, "N", "Driver", "Time", "Avg Speed");

    ft_write_ln(table, "1", "Ricciardo", "1:25.945", "222.128");
    ft_write_ln(table, "2", "Hamilton", "1:26.373", "221.027");
    ft_write_ln(table, "3", "Verstappen", "1:26.469", "220.782");

    printf("%s\n", ft_to_string(table));
    ft_destroy_table(table);

    return 0;
}
```

输出结果

```shell
$ gcc 1-simple_table.c ../lib/fort.c -I../lib  && ./a.out 

+---+------------+----------+-----------+
| N | Driver     | Time     | Avg Speed |
+---+------------+----------+-----------+
| 1 | Ricciardo  | 1:25.945 | 222.128   |
| 2 | Hamilton   | 1:26.373 | 221.027   |
| 3 | Verstappen | 1:26.469 | 220.782   |
+---+------------+----------+-----------+
```

示例: C++示例

```cpp
#include <iostream>

#include "fort.hpp"


int main()
{
    fort::char_table table;
    table << fort::header
        << "N" << "Driver" << "Time" << "Avg Speed" << fort::endr
        << "1" << "Ricciardo" << "1:25.945" << "47.362" << fort::endr
        << "2" << "Hamilton" << "1:26.373" << "35.02" << fort::endr
        << "3" << "Verstappen" << "1:26.469" << "29.78" << fort::endr;

    std::cout << table.to_string() << std::endl;
}
```

输出结果

```shell
g++ 1-simple_table.cpp ../lib/fort.c -I../lib  -std=c++11 && ./a.out

+---+------------+----------+-----------+
| N | Driver     | Time     | Avg Speed |
+---+------------+----------+-----------+
| 1 | Ricciardo  | 1:25.945 | 47.362    |
| 2 | Hamilton   | 1:26.373 | 35.02     |
| 3 | Verstappen | 1:26.469 | 29.78     |
+---+------------+----------+-----------+
```
