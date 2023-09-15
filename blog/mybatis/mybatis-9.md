[返回目录](/blog/mybatis/index.md)

# 九、动态SQL

Mybatis框架的动态SQL技术是一种根据特定条件动态拼装SQL语句的功能，它存在的意义是为了解决拼接SQL语句字符串时的痛点问题。

## 1、if

if标签可通过test属性的表达式进行判断，若表达式的结果为true，则标签中的内容会执行;反之标签中的内容不会执行


语法

```xml
<if test="var != '' and var != null">
    <!-- sql -->
</if>
```

示例

```xml
<!--  List<Emp> getEmpByCondition(Emp emp);-->
<!--  加上1=1使得：即使emp_name为空，也不会导致sql语句变成：where and xxx-->
<select id="getEmpByCondition" resultType="Emp">
    select * from t_emp where 1=1
    <if test="empName != null and empName != ''">
        and emp_name = #{empName}
    </if>
    <if test="age != null and age != ''">
        and age = #{age}
    </if>
    <if test="email != null and email != ''">
        and email = #{email}
    </if>
    <if test="sex != null and sex != ''">
        and sex = #{sex}
    </if>
</select>
```


## 2、where

1. 若where标签中的if条件都不满足，则where标签没有任何功能，即不会添加where关键字
2. 若where标签中的if条件满足，则where标签会自动添加where关键字，并将条件最前方多余的and/or去掉

```xml
<select id="getEmpByCondition" resultType="Emp">
    select * from t_emp
    <where>
        <if test="empName != null and empName != ''">
            and emp_name = #{empName}
        </if>
        <if test="age != null and age != ''">
            and age = #{age}
        </if>
        <if test="email != null and email != ''">
            and email = #{email}
        </if>
        <if test="sex != null and sex != ''">
            and sex = #{sex}
        </if>
    </where>
</select>

```

## 3、trim

trim用于去掉或添加标签中的内容

常用属性

- prefix：在trim标签中的内容的`前面`添加某些内容
- suffix：在trim标签中的内容的`后面`添加某些内容
- prefixOverrides：在trim标签中的内容的`前面`去掉某些内容
- suffixOverrides：在trim标签中的内容的`后面`去掉某些内容

若trim中的标签都不满足条件，则trim标签没有任何效果

```xml
<select id="getEmpByCondition" resultType="Emp">
    select * from t_emp
    <trim prefix="where" suffixOverrides="and|or">
        <if test="empName != null and empName != ''">
            emp_name = #{empName} and
        </if>
        <if test="age != null and age != ''">
            age = #{age} or
        </if>
        <if test="email != null and email != ''">
            email = #{email} and
        </if>
        <if test="sex != null and sex != ''">
            sex = #{sex}
        </if>
    </trim>
</select>

```

## 4、choose、when、otherwise

choose、when、otherwise相当于if...else if..else

when至少要有一个，otherwise至多只有一个

```xml
<select id="getEmpByChoose" resultType="Emp">
	select * from t_emp
	<where>
		<choose>
			<when test="empName != null and empName != ''">
				emp_name = #{empName}
			</when>
			<when test="age != null and age != ''">
				age = #{age}
			</when>
			<when test="sex != null and sex != ''">
				sex = #{sex}
			</when>
			<when test="email != null and email != ''">
				email = #{email}
			</when>
			<otherwise>
				did = 1
			</otherwise>
		</choose>
	</where>
</select>

```

## 5、foreach

属性：

- collection：设置要循环的数组或集合
- item：表示集合或数组中的每一个数据
- separator：设置循环体之间的分隔符，分隔符前后默认有一个空格，如`,`
- open：设置foreach标签中的内容的开始符
- close：设置foreach标签中的内容的结束符

批量查询

```xml
<select id="getEmpByForeachCondition" resultType="Emp">
    select * from t_emp
    where eid in
    <foreach collection="eids" item="eid" separator="," open="(" close=")">
        #{eid}
    </foreach>
</select>
<!-- select * from t_emp where eid in ( ? , ? , ? ) -->
```

或者

```xml
<select id="getEmpByForeachOrCondition" resultType="Emp">
    select * from t_emp where
    <foreach collection="eids" item="eid" separator="or">
        eid = #{eid}
    </foreach>
</select>
<!-- select * from t_emp where eid = ? or eid = ? or eid = ? -->
```

批量添加

```xml
<insert id="insertMoreByList">
        insert into t_emp
        (emp_name, age, sex, email)
        values
        <foreach collection="emps" item="emp" separator=",">
            (#{emp.empName},#{emp.age},#{emp.sex},#{emp.email})
        </foreach>
    </insert>
<!-- insert into t_emp (emp_name, age, sex, email) values (?,?,?,?) , (?,?,?,?) , (?,?,?,?) -->
```

## 6、SQL片段

sql片段，可以记录一段公共sql片段，在使用的地方通过include标签进行引入

声明sql片段

```xml
<sql id="empColumns">eid,emp_name,age,sex,email</sql>
```

引用sql片段

```xml
<select id="getEmpByCondition" resultType="Emp">
	select <include refid="empColumns"></include> from t_emp
</select>
<!-- select eid,emp_name,age,sex,email from t_emp -->
```