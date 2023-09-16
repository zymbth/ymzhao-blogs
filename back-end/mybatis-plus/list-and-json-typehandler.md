# PgSQL数组及json类型在Mybatis项目中的类型转换

## 一、类型转换

postgresql提供了很多数据类型，某些特殊的类型无法同java数据类型映射。

[MyBatis 类型转换器](https://blog.csdn.net/style6666/article/details/87659008)

Mybatis提供了一些默认的TypeHandler，但不包含诸如数组、json这些类型在内。为了使用pgsql的这些类型，我们可以自己添加一些特定的typehandler，注册后就可以标注使用了。

## 二、数组

数组typehandler教程很多，这里直接贴代码：

```java
package com.xxxxx.xxxxx.config;

import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;
import org.apache.ibatis.type.MappedJdbcTypes;
import org.apache.ibatis.type.TypeException;

import java.sql.*;

@MappedJdbcTypes(JdbcType.ARRAY)
public class ArrayTypeHandler extends BaseTypeHandler<Object[]> {
    private static final String TYPE_NAME_VARCHAR = "varchar";
    private static final String TYPE_NAME_INTEGER = "integer";
    private static final String TYPE_NAME_BOOLEAN = "boolean";
    private static final String TYPE_NAME_NUMERIC = "numeric";

    @Override
    public void setNonNullParameter(PreparedStatement ps, int i, Object[] parameter, JdbcType jdbcType) throws SQLException {
        String typeName = null;
        if (parameter instanceof Integer[]) {
            typeName = TYPE_NAME_INTEGER;
        } else if (parameter instanceof String[]) {
            typeName = TYPE_NAME_VARCHAR;
        } else if (parameter instanceof Boolean[]) {
            typeName = TYPE_NAME_BOOLEAN;
        } else if (parameter instanceof Double[]) {
            typeName = TYPE_NAME_NUMERIC;
        }

        if (typeName == null) {
            throw new TypeException("ArrayType2Handler parameter typeName error, your type is " + parameter.getClass().getName());
        }

        // 这3行是关键的代码，创建Array，然后ps.setArray(i, array)就可以了
        Connection conn = ps.getConnection();
        Array array = conn.createArrayOf(typeName, parameter);
        ps.setArray(i, array);

    }

    @Override
    public Object[] getNullableResult(ResultSet resultSet, String s) throws SQLException {
        return getArray(resultSet.getArray(s));
    }

    @Override
    public Object[] getNullableResult(ResultSet resultSet, int i) throws SQLException {
        return getArray(resultSet.getArray(i));
    }

    @Override
    public Object[] getNullableResult(CallableStatement callableStatement, int i) throws SQLException {
        return getArray(callableStatement.getArray(i));
    }

    private Object[] getArray(Array array) {
        if (array == null) {
            return null;
        }
        try {
            return (Object[]) array.getArray();
        } catch (Exception e) {
        }
        return null;
    }
}

```

代码中定义了“读写”的处理

具体使用：
entity中标注类型处理类

```java
@Data
@EqualsAndHashCode(callSuper = false)
@TableName("pd_product")
public class ProductAttribute extends OrgEntity {

    private static final long serialVersionUID = 1L;
    private Long productId;
    private String name;
    @TableField(typeHandler = com.xxxxx.xxxxx.config.ArrayTypeHandler.class)
    private String[] attributes;
}
```

在mapper或xml文件中自定义的sql包含该数据时，需要指明该项所应用的类型转换

xml中的相关语法：

```java
 <resultMap id="xxxxxxx" type="Product">
        <result property="id" column="id"/>
        <result property="state" column="state"/>
        <result property="name" column="name"/>
        <collection property="characteristics" ofType="ProductAttribute">
            <id property="id" column="pc_id"/>
            <result property="name" column="pc_name"/>
            <result property="attributes" column="pc_attrs" typeHandler="com.jundax.product.config.ArrayTypeHandler"/>
        </collection>
    </resultMap>

    <select id="XXXXXX" resultType="com.XXXXX.XXXXX.config.ArrayTypeHandler">
        SELECT attributes FROM pd.product WHERE id=#{id}
    </select>

    <update id="XXXXXXXXXXX">
        UPDATE pd.product SET update_time=now(), attributes = #{attrs,typeHandler=com.xxxxx.xxxxx.config.ArrayTypeHandler}
        WHERE id=#{id}
    </update>
</mapper>
```

## 二、Json

json的转换相对复杂一点，坑也很多，只给出本菜鸟实测通过的一种，如有问题，多多指正。本例数据库中json存储的是一个对象数组，对象用AttrModel.class存储

```java
package com.xxxxx.xxxxx.config;

import com.alibaba.fastjson.JSON;
import com.xxxxx.xxxxx.model.AttrModel;
import lombok.SneakyThrows;
import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;
import org.apache.ibatis.type.MappedJdbcTypes;
import org.apache.ibatis.type.MappedTypes;
import org.postgresql.util.PGobject;

import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

@MappedTypes(AttrModel[].class)
@MappedJdbcTypes(JdbcType.OTHER)
public class JSONTypeHandlerPg extends BaseTypeHandler<AttrModel[]> {

    private static final PGobject jsonObject = new PGobject();

    @Override
    public void setNonNullParameter(PreparedStatement ps, int i, AttrModel[] parameter, JdbcType jdbcType) throws SQLException {
        jsonObject.setType("json");
        jsonObject.setValue(JSON.toJSONString(parameter));
        ps.setObject(i, jsonObject);
    }

    @SneakyThrows
    @Override
    public AttrModel[] getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
        AttrModel[] object = JSON.parseObject(rs.getString(columnIndex), AttrModel[].class);
        return object;
    }

    @SneakyThrows
    @Override
    public AttrModel[] getNullableResult(CallableStatement cs, int columnIndex) throws SQLException {
        AttrModel[] object = JSON.parseObject(cs.getString(columnIndex), AttrModel[].class);
        return object;
    }

    @SneakyThrows
    @Override
    public AttrModel[] getNullableResult(ResultSet rs, String columnName) throws SQLException {
        AttrModel[] object = JSON.parseObject(rs.getString(columnName), AttrModel[].class);
        return object;
    }
}
```

可依据需要解析json，例如普通对象，可如下解析

```java
@MappedJdbcTypes(JdbcType.OTHER)
public class JSONTypeHandlerPgMap extends BaseTypeHandler<Map<String,Object>> {

    private static final PGobject jsonObject = new PGobject();

    @Override
    public void setNonNullParameter(PreparedStatement ps, int i, Map<String,Object> parameter, JdbcType jdbcType) throws SQLException {
        jsonObject.setType("json");
        jsonObject.setValue(JSON.toJSONString(parameter));
        ps.setObject(i, jsonObject);
    }
	// ...
    @SneakyThrows
    @Override
    public Map<String,Object> getNullableResult(ResultSet rs, String columnName) throws SQLException {
        Map<String,Object> object = JSON.parseObject(rs.getString(columnName), new TypeReference<Map<String, Object>>() {});
        return object;
    }
}
```

使用方法同数组类型转换类似。

**趟过的坑：**

- PGobject出错，依赖如下，runtime scope会导致此问题

```xml
<dependency>
	<groupId>org.postgresql</groupId>
	<artifactId>postgresql</artifactId>
	<scope>compile</scope>
</dependency>
```

- 注册

有些类型是不需要注册即可使用的，有些类型在未注册时BaseTypeHandler.class的处理会跳过ResultSet中的该字段，具体可自行调试查看。

```yml
mybatis-plus:
	type-handlers-package: com.xxxxx.xxxxx.config
```

使用mybatis注册

```yml
mybatis:
	type-handlers-package: com.xxxxx.xxxxx.config
```

- Json包

Jackson 是 Spring Boot 官方推荐的默认库，教程也很详细，完全能满足我的需求，但一直报错，菜鸟找不到原因，干脆换一个。。

Fastjson的使用也非常方便，教程很多。

```xml
<dependency>
	<groupId>com.alibaba</groupId>
	<artifactId>fastjson</artifactId>
	<version>1.2.25</version>
</dependency>
```

>相关文章：
>
>[postgresql----JSON和JSONB类型](https://blog.csdn.net/u012129558/article/details/81453640)
>
>[MyBatis中自定义typeHandler映射PostgreSQL中json类型字段](https://blog.csdn.net/Mr_EvanChen/article/details/81986791)
>
>[使用mybatis中的自定义TypeHandler处理PostgreSQL中的Json类型](https://blog.csdn.net/java_collect/article/details/80946303)
>
>[Fastjson Obejct/Map/JSON/String 互转](https://www.w3cschool.cn/fastjson/fastjson-ex2.html)
>
>[Jackson教程](https://www.yiibai.com/jackson/)
>
>[JSON解析-Jackson](https://yq.aliyun.com/articles/696266)
