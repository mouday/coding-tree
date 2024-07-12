# Java面试题-String

# String和StringBuffer、StringBuilder差异

- String 是不可变的，而StringBuffer、StringBuilder属于可变序列字符类，两者只需要扩容底层数组大小即可
- String 可直接赋值和使用构造函数，而 StringBuffer、StringBuilder 只能使用构造函数
- StringBuffer 适合多线程下，线程安全的，但是效率低些，因为加了 `synchronized` 关键字
- StringBuilder适合单线程，线程不安全，但是速度快
