# PDB 使用详细教程

pdb（Python Debugger）是 Python 标准库内置的交互式源代码调试器，无需额外安装，开箱即用。它支持设置断点、单步执行、堆栈查看、任意 Python 表达式求值，以及事后调试等功能，适用于快速定位逻辑错误、运行时异常和执行流程问题。

下面我们将从一个完整的示例出发，逐步展开一个详细的教程。

### 1. 三种启动方式

**方式一：命令行直接运行**

```bash
python -m pdb script.py
```

这种方式会从脚本第一行开始进入调试模式，适合从头开始调试整个程序。如果被调试的程序异常退出，pdb 会自动进入事后调试。

**方式二：代码中插入断点**

```python
import pdb; pdb.set_trace()   # 经典写法
breakpoint()                  # Python 3.7+ 推荐写法
```

在想要暂停的代码位置插入上述语句，程序运行到该行时就会暂停并进入调试模式。

**方式三：事后调试（Post-Mortem Debugging）**

```python
import pdb
try:
    risky_code()
except Exception:
    pdb.post_mortem()   # 进入崩溃现场调试
```

或者在交互式环境中，运行出错后直接调用 `pdb.pm()` 进入最后一次未捕获异常的上下文。

### 2. 核心命令速查

进入调试模式后，会看到 `(Pdb)` 提示符，此时可输入以下命令：

| 命令             | 缩写         | 功能说明                                       |
| :--------------- | :----------- | :--------------------------------------------- |
| `next`           | `n`          | 执行下一行，遇到函数调用时不进入函数内部       |
| `step`           | `s`          | 单步执行，遇到函数调用时进入函数内部           |
| `continue`       | `c`          | 继续执行直到下一个断点或程序结束               |
| `list`           | `l`          | 显示当前位置附近的 11 行源代码                 |
| `print <变量名>` | `p <变量名>` | 打印变量值，支持表达式如 `p len(data)`         |
| `pp <变量名>`    | `pp`         | 美化打印（pretty print），字典、嵌套结构更清晰 |
| `break <行号>`   | `b <行号>`   | 在当前文件的指定行设置断点                     |
| `where`          | `w`          | 显示当前调用堆栈                               |
| `up` / `down`    | `u` / `d`    | 上下切换堆栈帧，查看不同层级的变量             |
| `quit`           | `q`          | 退出调试器并终止程序                           |
| `help`           | `h`          | 查看帮助信息                                   |

### 3. 断点管理详解

断点是 pdb 最核心的功能之一，灵活使用断点可以大幅提升调试效率。

**设置断点：**

```python
(Pdb) b 15                  # 在第15行设置断点
(Pdb) b module.py:20        # 在指定文件的第20行设置断点
(Pdb) b my_function         # 在函数入口设置断点
(Pdb) tbreak 15             # 临时断点，触发一次后自动删除
```

**查看与删除断点：**

```python
(Pdb) b                     # 列出所有断点
(Pdb) cl 1                  # 删除编号为1的断点
(Pdb) cl                    # 删除所有断点
```

**条件断点：**

```python
(Pdb) b 15, i > 100         # 仅当 i > 100 时触发断点
(Pdb) condition 1 i == 10   # 为编号1的断点设置条件
```

**启用/禁用断点：**

```python
(Pdb) disable 1             # 禁用编号为1的断点
(Pdb) enable 1              # 重新启用编号为1的断点
```

### 4. 堆栈与变量查看

当程序在多层函数调用中暂停时，查看调用堆栈有助于理解执行路径。

**堆栈操作：**

```python
(Pdb) w                     # 显示调用堆栈（where）
(Pdb) u                     # 向上移动一层堆栈帧（up）
(Pdb) d                     # 向下移动一层堆栈帧（down）
```

**变量查看技巧：**

```python
(Pdb) a                     # 显示当前函数的所有参数（args）
(Pdb) pp locals()           # 美化打印所有局部变量
(Pdb) whatis var_name       # 查看变量类型
(Pdb) !print(x)             # 执行任意 Python 语句（感叹号前缀）
```

**注意：** 直接按回车键会重复执行上一条命令，对于连续按 `n` 单步执行非常方便。

### 5. 完整调试示例

以下是一个完整的调试示例，展示从启动到排查问题的完整流程：

```python
# debug_example.py
def calculate_average(numbers):
    """计算列表平均值，但有一个 bug"""
    total = 0
    for i, num in enumerate(numbers):
        total += num
        if i == 3:                     # 在某个条件下暂停
            breakpoint()               # 程序会在这里暂停
    count = len(numbers)
    return total / count

def main():
    data = [10, 20, 30, 40, 50]
    result = calculate_average(data)
    print(f"平均值是: {result}")

if __name__ == "__main__":
    main()
```

**调试过程演示：**

```python
# 运行程序，遇到 breakpoint() 暂停
> debug_example.py(6)calculate_average()
-> count = len(numbers)

# 1. 查看当前位置的代码
(Pdb) l
  1     def calculate_average(numbers):
  2         total = 0
  3         for i, num in enumerate(numbers):
  4             total += num
  5             if i == 3:
  6  ->             breakpoint()
  7         count = len(numbers)
  8         return total / count

# 2. 查看当前变量的值
(Pdb) p total
100                              # 10+20+30+40 = 100
(Pdb) p i
3
(Pdb) p num
40
(Pdb) p numbers
[10, 20, 30, 40, 50]

# 3. 继续执行到函数返回
(Pdb) n
> debug_example.py(8)calculate_average()
-> return total / count
(Pdb) p count
5
(Pdb) c
平均值是: 20.0                # 程序继续执行完毕
```

### 6. 实用技巧汇总

**1. 跳过循环：**

```python
(Pdb) unt 50                 # 直接运行到第50行，跳过中间循环体
```

**2. 执行任意 Python 语句：**

```python
(Pdb) !x = [1, 2, 3]         # 修改变量值（感叹号前缀）
(Pdb) !import sys; sys.path  # 执行复杂语句
```

**3. 调试异常而不修改代码：**

```python
# 安装全局异常钩子，任何未捕获异常都会自动进入 pdb
import sys
import pdb

def debug_excepthook(type, value, traceback):
    pdb.pm()

sys.excepthook = debug_excepthook
```

**4. 全局禁用 breakpoint()：**

```python
# 设置环境变量即可在生产环境中安全保留 breakpoint()
export PYTHONBREAKPOINT=0
```

### 7. 替代与增强方案

pdb 功能扎实但界面相对简陋，可考虑以下增强：

- **ipdb**：IPython 版的 pdb，支持语法高亮、Tab 补全和更好的美化输出。

  ```bash
  pip install ipdb
  ```

  使用方法：将 `breakpoint()` 替换为 `import ipdb; ipdb.set_trace()`。

- **pdb++**：提供更友好的彩色界面和智能补全。

- **IDE 图形调试器**：PyCharm、VS Code 等 IDE 内置的图形化调试器，底层仍调用 pdb 协议，但提供更直观的可视化体验。

### 8. 注意事项与避坑指南

| 常见问题                               | 解决方案                                                             |
| :------------------------------------- | :------------------------------------------------------------------- |
| `NameError: name 'pdb' is not defined` | 确保先 `import pdb` 再调用 `pdb.set_trace()`                         |
| 断点不生效                             | 检查代码是否确实执行到了该行（如条件分支未进入），或模块是否被重载过 |
| 多线程/多进程中断点失效                | pdb 默认只跟踪主线程，需在每个子进程/子线程中单独插入断点            |
| 生产环境误留 `breakpoint()`            | 通过 `PYTHONBREAKPOINT=0` 全局禁用                                   |
| Jupyter 中无法使用 pdb                 | 使用 `ipdb` 或 `%debug` 魔法命令                                     |

---

如果你在实际使用中遇到了某个具体的调试场景（比如多线程、异步代码或特定的异常类型），可以告诉我具体需求，我来帮你设计更针对性的调试方案。
