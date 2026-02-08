# huadb

执行入口

```cpp
DatabaseEngine::ExecuteSql
```

重要的类

```cpp
class RecordHeader {
    bool deleted_ = false;
}
class Record {
    RecordHeader header_;
}

class TablePage {
    std::shared_ptr<Page> page_;
}

class Page {
    char *data_;
}


class Table {
  oid_t oid_;
  oid_t db_oid_;
}

class TableScan {
    std::shared_ptr<Table> table_;
}

class LogRecord {}

class InsertLog : public LogRecord {}
class DeleteLog : public LogRecord {}

class Operator {}

```
