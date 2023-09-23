[返回目录](/blog/spring/index.md)

# 三、容器IoC

IoC Inversion of Control 控制反转

它不是一门技术，而是一种设计思想。

Spring 通过 `IoC 容器` 来管理所有 Java 对象的实例化和初始化，控制对象与对象之间的依赖关系。我们将由 IoC 容器管理的 Java 对象称为 Spring Bean，它与使用关键字 new 创建的 Java 对象没有任何区别。


## IoC容器

### 3.1.1、控制反转（IoC）

- 控制反转是一种思想。
- 控制反转是为了降低程序耦合度，提高程序扩展力。
- 控制反转，反转的是什么？
    - 将对象的创建权利交出去，交给第三方容器负责。
    - 将对象和对象之间关系的维护权交出去，交给第三方容器负责。

- 控制反转这种思想如何实现呢？

    - DI（Dependency Injection）：依赖注入

#### 3.1.2、依赖注入

DI（Dependency Injection）：依赖注入，依赖注入实现了控制反转的思想。

**依赖注入：**

- **指Spring创建对象的过程中，将对象依赖属性通过配置进行注入**

依赖注入常见的实现方式包括两种：

- 第一种：set注入
- 第二种：构造注入

所以结论是：IOC 就是一种控制反转的思想， 而 DI 是对IoC的一种具体实现。

**Bean管理说的是：Bean对象的创建，以及Bean对象中属性的赋值（或者叫做Bean对象之间关系的维护）。**



#### 3.1.3、IoC容器在Spring的实现

Spring 的 IoC 容器就是 IoC思想的一个落地的产品实现。IoC容器中管理的组件也叫做 bean。在创建 bean 之前，首先需要创建IoC 容器。Spring 提供了IoC 容器的两种实现方式：

**①BeanFactory**

这是 IoC 容器的基本实现，是 Spring 内部使用的接口。面向 Spring 本身，不提供给开发人员使用。

**②ApplicationContext**

BeanFactory 的子接口，提供了更多高级特性。面向 Spring 的使用者，几乎所有场合都使用 ApplicationContext 而不是底层的 BeanFactory。

**③ApplicationContext的主要实现类**


| 类型名                          | 简介                                                         |
| ------------------------------- | ------------------------------------------------------------ |
| ClassPathXmlApplicationContext  | 通过读取类路径下的 XML 格式的配置文件创建 IOC 容器对象       |
| FileSystemXmlApplicationContext | 通过文件系统路径读取 XML 格式的配置文件创建 IOC 容器对象     |
| ConfigurableApplicationContext  | ApplicationContext 的子接口，包含一些扩展方法 refresh() 和 close() ，让 ApplicationContext 具有启动、关闭和刷新上下文的能力。 |
| WebApplicationContext           | 专门为 Web 应用准备，基于 Web 环境创建 IOC 容器对象，并将对象引入存入 ServletContext 域中。 |



## 基于XML管理Bean

搭建子模块 spring6-ioc-xml

创建User类

```java
package com.atguigu.spring6;

public class User {

    private String name;

    private Integer age;

    public void run() {
        System.out.println("run...");
    }
}

```

bean.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="user" class="com.atguigu.spring6.User"></bean>
</beans>
```
### 获取bean

```java
package com.atguigu.spring6;

import org.junit.jupiter.api.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import static org.junit.jupiter.api.Assertions.*;

class UserTest {

    @Test
    void run() {
        ApplicationContext context = new ClassPathXmlApplicationContext("bean.xml");

        // 方式一：根据id获取bean
        User user1 = (User) context.getBean("user");
        System.out.println(user1);

        // 方式二：根据类型获取bean
        User user2 = context.getBean(User.class);
        System.out.println(user2);

        // 方式三：根据id和类型
        User user3 = context.getBean("user", User.class);
        System.out.println(user3);

    }
}
```

注意的地方

当根据类型获取bean时，要求IOC容器中指定类型的bean有且只能有一个

扩展知识

如果组件类实现了接口，根据接口类型可以获取 bean 吗？

> 可以，前提是bean唯一

如果一个接口有多个实现类，这些实现类都配置了 bean，根据接口类型可以获取 bean 吗？

> 不行，因为bean不唯一

**结论**

根据类型来获取bean时，在满足bean唯一性的前提下，其实只是看：『对象 **instanceof** 指定的类型』的返回结果，只要返回的是true就可以认定为和类型匹配，能够获取到。

java中，instanceof运算符用于判断前面的对象是否是后面的类，或其子类、实现类的实例。如果是返回true，否则返回false。也就是说：用instanceof关键字做判断时， instanceof 操作符的左右操作必须有继承或实现关系


### 依赖注入


手动注入的示例

```java
package com.atguigu.spring6;

public class Student {
    private String name;

    private Integer age;

    public Student() {
    }

    public Student(String name, Integer age) {
        this.name = name;
        this.age = age;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    @Override
    public String toString() {
        return "Student{" +
                "name='" + name + '\'' +
                ", age=" + age +
                '}';
    }

    public static void main(String[] args) {
        // 通过set对属性赋值
        Student student1 = new Student();
        student1.setAge(18);
        student1.setName("Tom");

        // 通过构造器对属性赋值
        Student student2 = new Student("Jack", 23);
    }
}

```


### 依赖注入之setter注入

bean-student.xml

```xml
<!--通过set注入-->
<bean id="student" class="com.atguigu.spring6.Student">
    <property name="age" value="20"></property>
    <property name="name" value="Tom"></property>
</bean>
```

测试

```java
class StudentTest {
    @Test
    public void testSetter(){
        ApplicationContext context = new ClassPathXmlApplicationContext("bean-student.xml");
        Student student = context.getBean("student", Student.class);
        System.out.println(student);
        // Student{name='Tom', age=20}
    }
}
```

### 依赖注入之构造器注入

```xml
<!-- 通过构造器注入   -->
<bean id="studentConstructor" class="com.atguigu.spring6.Student">
    <constructor-arg name="age" value="23"></constructor-arg>
    <constructor-arg name="name" value="Jack"></constructor-arg>
</bean>
```

```java

class StudentTest {
    @Test
    public void testConstructor(){
        ApplicationContext context = new ClassPathXmlApplicationContext("bean-student.xml");
        Student student = context.getBean("studentConstructor", Student.class);
        System.out.println(student);
        // Student{name='Jack', age=23}
    }
}
```

### 特殊值处理

1、字面量赋值

```xml
<property name="name" value="张三"/>
```

2、null值

```xml
<property name="name">
    <null />
</property>
```

3、xml实体

```xml
<!-- 小于号在XML文档中用来定义标签的开始，不能随便使用 -->
<!-- 解决方案一：使用XML实体来代替 -->
<property name="expression" value="a &lt; b"/>
```

4、CDATA节

```xml
<property name="expression">
    <!-- 解决方案二：使用CDATA节 -->
    <!-- CDATA中的C代表Character，是文本、字符的含义，CDATA就表示纯文本数据 -->
    <!-- XML解析器看到CDATA节就知道这里是纯文本，就不会当作XML标签或属性来解析 -->
    <!-- 所以CDATA节中写什么符号都随意 -->
    <value><![CDATA[a < b]]></value>
</property>
```


### 对象类型属性赋值

部门员工案例

部门和员工关系：一对多

```java
package com.atguigu.spring6.company;

/**
 * 部门
 */
public class Dept {
    private String dname;

    public String getDname() {
        return dname;
    }

    public void setDname(String dname) {
        this.dname = dname;
    }

    public void info(){
        System.out.println("info: " + this.dname);
    }

    @Override
    public String toString() {
        return "Dept{" +
                "dname='" + dname + '\'' +
                '}';
    }
}

```


```java
package com.atguigu.spring6.company;

/**
 * 员工
 */
public class Emp {
    private String ename;
    private Integer age;

    private Dept dept;

    public String getEname() {
        return ename;
    }

    public void setEname(String ename) {
        this.ename = ename;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public Dept getDept() {
        return dept;
    }

    public void setDept(Dept dept) {
        this.dept = dept;
    }

    public void work(){
        System.out.println(this.ename + " work... "  + this.age);
        this.dept.info();
    }

    @Override
    public String toString() {
        return "Emp{" +
                "ename='" + ename + '\'' +
                ", age=" + age +
                '}';
    }
}
```

配置文件 bean-emp.xml

1、引用外部bean

```xml
<bean id="dept" class="com.atguigu.spring6.company.Dept">
    <property name="dname" value="财务部"></property>
</bean>

<bean id="emp" class="com.atguigu.spring6.company.Emp">
    <property name="ename" value="Tom"></property>
    <property name="age" value="20"></property>
    <property name="dept" ref="dept"></property>
</bean>
```

ref属性：引用IOC容器中某个bean的id，将所对应的bean为属性赋值

2、内部bean

```xml
<bean id="emp2" class="com.atguigu.spring6.company.Emp">
    <property name="ename" value="Tom"></property>
    <property name="age" value="20"></property>
    <property name="dept">
        <bean id="dept2" class="com.atguigu.spring6.company.Dept">
            <property name="dname" value="财务部"></property>
        </bean>
    </property>
</bean>    
```

在一个bean中再声明一个bean就是内部bean

内部bean只能用于给属性赋值，不能在外部通过IOC容器获取，因此可以省略id属性


3、级联属性赋值

```xml
<bean id="dept3" class="com.atguigu.spring6.company.Dept">
    <property name="dname" value="财务部"></property>
</bean>

<bean id="emp3" class="com.atguigu.spring6.company.Emp">
    <property name="ename" value="Tom"></property>
    <property name="age" value="20"></property>
    <property name="dept" ref="dept3"></property>
    <property name="dept.dname" value="研发部"></property>
</bean>
```
测试类

```java
package com.atguigu.spring6;

import com.atguigu.spring6.company.Emp;
import org.junit.jupiter.api.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class EmpTest {
    @Test
    public void test() {
        ApplicationContext context = new ClassPathXmlApplicationContext("bean-emp.xml");
        Emp emp = context.getBean("emp", Emp.class);
        emp.work();
        // Tom work... 20
        // info: 财务部
    }
}

```

为数组类型属性赋值

增加属性

```java
private String[] hobbies;

public String[] getHobbies() {
    return hobbies;
}

public void setHobbies(String[] hobbies) {
    this.hobbies = hobbies;
}
```
```xml
<bean id="emp" class="com.atguigu.spring6.company.Emp">
    <property name="hobbies">
        <array>
            <value>抽烟</value>
            <value>喝酒</value>
            <value>烫头</value>
        </array>
    </property>
</bean>
```

测试类
```java
@Test
public void testArray() {
    ApplicationContext context = new ClassPathXmlApplicationContext("bean-array.xml");
    Emp emp = context.getBean("emp", Emp.class);
    System.out.println(Arrays.toString(emp.getHobbies()));
    // [抽烟, 喝酒, 烫头]
}
```

为List集合类型属性赋值

```java
private List<Emp> empList;
```

```xml
<bean id="emp1" class="com.atguigu.spring6.company.Emp">
    <property name="ename" value="Tom"></property>
    <property name="age" value="20"></property>
</bean>

<bean id="emp2" class="com.atguigu.spring6.company.Emp">
    <property name="ename" value="Jack"></property>
    <property name="age" value="30"></property>
</bean>

<bean id="dept" class="com.atguigu.spring6.company.Dept">
    <property name="empList">
        <list>
            <ref bean="emp1"></ref>
            <ref bean="emp2"></ref>
        </list>
    </property>
</bean>
```

> 若为Set集合类型属性赋值，只需要将其中的list标签改为set标签即可


为Map集合类型属性赋值

```java
public class Teacher {

    private Integer teacherId;

    private String teacherName;

}

public class Student{
    private Map<String, Teacher> teacherMap;
}
```

```xml
<bean id="teacherOne" class="com.atguigu.spring6.bean.Teacher">
    <property name="teacherId" value="10010"></property>
    <property name="teacherName" value="大宝"></property>
</bean>

<bean id="teacherTwo" class="com.atguigu.spring6.bean.Teacher">
    <property name="teacherId" value="10086"></property>
    <property name="teacherName" value="二宝"></property>
</bean>

<bean id="studentFour" class="com.atguigu.spring6.bean.Student">
    <property name="id" value="1004"></property>
    <property name="name" value="赵六"></property>
    <property name="age" value="26"></property>
    <property name="sex" value="女"></property>
    <!-- ref属性：引用IOC容器中某个bean的id，将所对应的bean为属性赋值 -->
    <property name="clazz" ref="clazzOne"></property>
    <property name="hobbies">
        <array>
            <value>抽烟</value>
            <value>喝酒</value>
            <value>烫头</value>
        </array>
    </property>
    <property name="teacherMap">
        <map>
            <entry>
                <key>
                    <value>10010</value>
                </key>
                <ref bean="teacherOne"></ref>
            </entry>
            <entry>
                <key>
                    <value>10086</value>
                </key>
                <ref bean="teacherTwo"></ref>
            </entry>
        </map>
    </property>
</bean>
```

引用集合类型的bean

```xml
<!--list集合类型的bean-->
<util:list id="students">
    <ref bean="studentOne"></ref>
    <ref bean="studentTwo"></ref>
    <ref bean="studentThree"></ref>
</util:list>
<!--map集合类型的bean-->
<util:map id="teacherMap">
    <entry>
        <key>
            <value>10010</value>
        </key>
        <ref bean="teacherOne"></ref>
    </entry>
    <entry>
        <key>
            <value>10086</value>
        </key>
        <ref bean="teacherTwo"></ref>
    </entry>
</util:map>

<bean id="clazzTwo" class="com.atguigu.spring6.bean.Clazz">
    <property name="clazzId" value="4444"></property>
    <property name="clazzName" value="Javaee0222"></property>
    <property name="students" ref="students"></property>
</bean>

<bean id="studentFour" class="com.atguigu.spring6.bean.Student">
    <property name="id" value="1004"></property>
    <property name="name" value="赵六"></property>
    <property name="age" value="26"></property>
    <property name="sex" value="女"></property>
    <!-- ref属性：引用IOC容器中某个bean的id，将所对应的bean为属性赋值 -->
    <property name="clazz" ref="clazzOne"></property>
    <property name="hobbies">
        <array>
            <value>抽烟</value>
            <value>喝酒</value>
            <value>烫头</value>
        </array>
    </property>
    <property name="teacherMap" ref="teacherMap"></property>
</bean>
```

使用util:list、util:map标签必须引入相应的命名空间

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:util="http://www.springframework.org/schema/util"
       xsi:schemaLocation="http://www.springframework.org/schema/util
       http://www.springframework.org/schema/util/spring-util.xsd
       http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd">
</beans>
```

### p命名空间

引入p命名空间

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:util="http://www.springframework.org/schema/util"
       xmlns:p="http://www.springframework.org/schema/p"
       xsi:schemaLocation="http://www.springframework.org/schema/util
       http://www.springframework.org/schema/util/spring-util.xsd
       http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd">
</beans>
```

引入p命名空间后，可以通过以下方式为bean的各个属性赋值

```xml
<bean id="studentSix" 
    class="com.atguigu.spring6.bean.Student"
    p:id="1006" 
    p:name="小明" 
    p:clazz-ref="clazzOne" 
    p:teacherMap-ref="teacherMap"
></bean>
```


### 引入外部属性文件

①加入依赖

```xml
 <!-- MySQL驱动 -->
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>8.0.30</version>
</dependency>

<!-- 数据源 -->
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>druid</artifactId>
    <version>1.2.15</version>
</dependency>
```

②创建外部属性文件

jdbc.properties

```bash
jdbc.user=root
jdbc.password=atguigu
jdbc.url=jdbc:mysql://localhost:3306/ssm?serverTimezone=UTC
jdbc.driver=com.mysql.cj.jdbc.Driver
```

③引入属性文件

引入context 名称空间

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd
       http://www.springframework.org/schema/context
       http://www.springframework.org/schema/context/spring-context.xsd">

</beans>
```

```xml
<!-- 引入外部属性文件 -->
<context:property-placeholder location="classpath:jdbc.properties"/>
```

注意：在使用 `<context:property-placeholder>` 元素加载外包配置文件功能前，首先需要在 XML 配置的一级标签 `<beans>` 中添加 context 相关的约束。


④配置bean

```xml
<bean id="druidDataSource" class="com.alibaba.druid.pool.DruidDataSource">
    <property name="url" value="${jdbc.url}"/>
    <property name="driverClassName" value="${jdbc.driver}"/>
    <property name="username" value="${jdbc.user}"/>
    <property name="password" value="${jdbc.password}"/>
</bean>
```

⑤测试

```java
@Test
public void testDataSource() throws SQLException {
    ApplicationContext ac = new ClassPathXmlApplicationContext("spring-datasource.xml");
    DataSource dataSource = ac.getBean(DataSource.class);
    Connection connection = dataSource.getConnection();
    System.out.println(connection);
}
```

### bean的作用域

①概念

在Spring中可以通过配置bean标签的scope属性来指定bean的作用域范围，各取值含义参加下表：

| 取值 | 含义 | 创建对象的时机  |
| -| - | - |
| singleton（默认） | 在IOC容器中，这个bean的对象始终为单实例 | IOC容器初始化时 |
| prototype   | 这个bean在IOC容器中有多个实例   | 获取bean时 |

如果是在WebApplicationContext环境下还会有另外几个作用域（但不常用）：

| 取值    | 含义     |
| ------- | -------------------- |
| request | 在一个请求范围内有效 |
| session | 在一个会话范围内有效 |

②创建类User


```java
package com.atguigu.spring6.bean;

public class User {

    private Integer id;

    private String username;

    private String password;

    private Integer age;

    // getset方法省略
}
```

③配置bean

```xml
<!-- scope属性：取值singleton（默认值），bean在IOC容器中只有一个实例，IOC容器初始化时创建对象 -->
<!-- scope属性：取值prototype，bean在IOC容器中可以有多个实例，getBean()时创建对象 -->
<bean class="com.atguigu.spring6.bean.User" scope="prototype"></bean>
```

④测试

```java
@Test
public void testBeanScope(){
    ApplicationContext ac = new ClassPathXmlApplicationContext("spring-scope.xml");
    User user1 = ac.getBean(User.class);
    User user2 = ac.getBean(User.class);
    System.out.println(user1==user2);
}
```


## 基于注解管理Bean

