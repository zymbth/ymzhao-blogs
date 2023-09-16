# Mybatis-Plus条件构造器and or嵌套使用

> Mybatis-Plus的条件构造器可以很方便的构造查询语句，但有时，条件并不是简单拼接的，需要注意优先级导致的问题。

A and B or C 并不等于 A and (B or C)

```java
QueryWrapper<Partner> wrapper = new QueryWrapper<Partner>()
 .eq("a", "A").eq("b", "B").or().eq("c", "C");
```

参考[官网](https://baomidou.com/guide/wrapper.html#or)可知and, or都有嵌套写法。

```java
// A or (B and C)
.eq("a", "A").or(i -> i.eq("b", "B").eq("c", "C"));

// A or (B or C)
.eq("a", "A").or(i -> i.eq("b", "B").or().eq("c", "C"));

// A and (B and C)
.eq("a", "A").and(i -> i.eq("b", "B").eq("c", "C"));

// A and (B or C)
.eq("a", "A").and(i -> i.eq("b", "B").or().eq("c", "C"));
```

借助and, or的嵌套写法，给sql语句加上括号，避免默认优先级导致的sql语句错误，结合调试信息发现错误。

复杂的查询，可以考虑直接自定义sql语句。

## 示例

要求显示状态为“1”的收款单、退款单和所有状态的手工收款单、手工退款单

```java
QueryWrapper<Payment> wrapper = new QueryWrapper<Payment>()
 .isNull("delete_time")
 .eq("oid", "1")
 .orderByDesc("create_time", "id");

wrapper.and(i -> i.eq("status", "1").in("type_name", "收款单", "退款单")
 .or().in("type_name", "手工收款单", "手工退款单"));
```

打印的sql语句如下：

```sql
SELECT * FROM am.am_payment
WHERE (
 delete_time IS NULL
 AND
 oid = ? 
 AND (
  status = ?
  AND
  type_name IN (?,?)
  OR
  type_name IN (?,?)
 )
)
ORDER BY create_time DESC,id DESC
limit ?
offset ? 
```
