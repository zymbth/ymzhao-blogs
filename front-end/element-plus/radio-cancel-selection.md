---
description: Element Plus 的单选框默认无法取消已选中的选择，如何才能取消已选中的选择？
head:
  - - meta
    - name: keywords
      content: element-plus,radio,cancel,selection
created: '2026-02-10'
---

# ElementPlus 单选框取消选择方案

## 前言

Element Plus 的单选框默认无法取消已选中的选择，有些业务场景下，不做选择是有意义的，如何才能取消已选中的选择？

## 方案

### 方案一：拦截 Radio 组件点击事件，手动更新 Radio Group 的取值

点击已选择的 Radio 取消选择

在线演示：

<DemoIframe
  title="拦截 Radio 组件点击事件，手动更新 Radio Group 的取值"
  src="https://element-plus.run/#eyJBcHAudnVlIjoiPHRlbXBsYXRlPlxuICA8aDI+UmFkaW8g55qE5Y+W5raI6YCJ5oup5pa55qGIPC9oMj5cbiAgPGhyLz5cbiAgPGgzPuaWueahiOS4gO+8muaLpuaIqiBSYWRpbyDnu4Tku7bngrnlh7vkuovku7bvvIzmiYvliqjmm7TmlrAgUmFkaW8gR3JvdXAg55qE5Y+W5YC8PC9oMz5cbiAgPHA+54K55Ye75bey6YCJ5oup55qEIFJhZGlvIOWPlua2iOmAieaLqTwvcD5cbiAgPHA+UmFkaW8gR3JvdXAgVmFsdWU6IHt7IHJhZGlvIH19PC9wPlxuICA8ZWwtcmFkaW8tZ3JvdXAgdi1tb2RlbD1cInJhZGlvXCI+XG4gICAgPGVsLXJhZGlvIHYtZm9yPVwibyBpbiBsaXN0XCIgOmtleT1cIm8udmFsdWVcIiB2LWJpbmQ9XCJvXCIgQGNsaWNrLnByZXZlbnQ9XCJoYW5kbGVSYWRpb0NsaWNrKG8udmFsdWUpXCIgLz5cbiAgPC9lbC1yYWRpby1ncm91cD5cbiAgPGgzPuaWueahiOS6jO+8muaWsOWinuS4gOS4quepuueZvSBSYWRpbzwvaDM+XG4gIDxwPlJhZGlvIEdyb3VwIFZhbHVlOiB7eyByYWRpbzEgfX08L3A+XG4gIDxlbC1yYWRpby1ncm91cCB2LW1vZGVsPVwicmFkaW8xXCI+XG4gICAgPGVsLXJhZGlvIHYtZm9yPVwibyBpbiBsaXN0XCIgOmtleT1cIm8udmFsdWVcIiB2LWJpbmQ9XCJvXCIgLz5cbiAgICA8ZWwtcmFkaW8gdmFsdWU9XCJcIiBsYWJlbD1cIuepulwiIC8+XG4gIDwvZWwtcmFkaW8tZ3JvdXA+XG4gIDxoci8+XG4gIDxoMz7mm7/mjaLmlrnmoYjvvJpTZWxlY3Tmm7/mjaI8L2gzPlxuICA8cD5TZWxlY3RvciBWYWx1ZToge3sgc2VsZWN0IH19PC9wPlxuICA8ZWwtc2VsZWN0IHYtbW9kZWw9XCJzZWxlY3RcIiBjbGVhcmFibGU+XG4gICAgPGVsLW9wdGlvbiB2LWZvcj1cIm8gaW4gbGlzdFwiIDprZXk9XCJvLnZhbHVlXCIgdi1iaW5kPVwib1wiIC8+XG4gIDwvZWwtc2VsZWN0PlxuICA8aDM+6L6F5Yqp5pa55qGI77ya6YeN572u6KGo5Y2VPC9oMz5cbiAgPHA+UmFkaW8gR3JvdXAgVmFsdWU6IHt7IGZvcm0ucmFkaW8gfX08L3A+XG4gIDxlbC1mb3JtIHJlZj1cImZvcm1SZWZcIiA6bW9kZWw9XCJmb3JtXCIgbGFiZWwtd2lkdGg9XCJhdXRvXCI+XG4gICAgPGVsLWZvcm0taXRlbSBsYWJlbD1cIuWfjuW4glwiIHByb3A9XCJyYWRpb1wiPlxuICAgICAgPGVsLXJhZGlvLWdyb3VwIHYtbW9kZWw9XCJmb3JtLnJhZGlvXCI+XG4gICAgICAgIDxlbC1yYWRpbyB2LWZvcj1cIm8gaW4gbGlzdFwiIDprZXk9XCJvLnZhbHVlXCIgdi1iaW5kPVwib1wiIC8+XG4gICAgICA8L2VsLXJhZGlvLWdyb3VwPlxuICAgIDwvZWwtZm9ybS1pdGVtPlxuICAgIDxlbC1mb3JtLWl0ZW0+XG4gICAgICA8ZWwtYnV0dG9uIHR5cGU9XCJwcmltYXJ5XCIgQGNsaWNrPVwiKCkgPT4gZm9ybVJlZj8ucmVzZXRGaWVsZHMoKVwiPlJlc2V0PC9lbC1idXR0b24+XG4gICAgPC9lbC1mb3JtLWl0ZW0+XG4gIDwvZWwtZm9ybT5cbjwvdGVtcGxhdGU+XG5cbjxzY3JpcHQgc2V0dXA+XG5pbXBvcnQgeyByZWYsIHJlYWN0aXZlIH0gZnJvbSAndnVlJ1xuXG5jb25zdCByYWRpbyA9IHJlZignJylcbmNvbnN0IHJhZGlvMSA9IHJlZignJylcbmNvbnN0IHNlbGVjdCA9IHJlZignJylcbmNvbnN0IGZvcm0gPSByZWFjdGl2ZSh7IHJhZGlvOiAnJyB9KVxuY29uc3QgZm9ybVJlZiA9IHJlZigpXG5jb25zdCBsaXN0ID0gW1xuICB7IHZhbHVlOiAnYmVpamluZycsIGxhYmVsOiAn5YyX5LqsJyB9LFxuICB7IHZhbHVlOiAnc2hhbmdoYWknLCBsYWJlbDogJ+S4iua1tycgfSxcbiAgeyB2YWx1ZTogJ3NoZW56aGVuJywgbGFiZWw6ICfmt7HlnLMnIH0sXG5dXG5cbmZ1bmN0aW9uIGhhbmRsZVJhZGlvQ2xpY2sodmFsKSB7XG4gIHJhZGlvLnZhbHVlID0gcmFkaW8udmFsdWUgPT09IHZhbCA/IG51bGwgOiB2YWxcbn1cbjwvc2NyaXB0PlxuIiwiZWxlbWVudC1wbHVzLmpzIjoiaW1wb3J0IEVsZW1lbnRQbHVzIGZyb20gJ2VsZW1lbnQtcGx1cydcbmltcG9ydCB7IGdldEN1cnJlbnRJbnN0YW5jZSB9IGZyb20gJ3Z1ZSdcblxubGV0IGluc3RhbGxlZCA9IGZhbHNlXG5hd2FpdCBsb2FkU3R5bGUoKVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0dXBFbGVtZW50UGx1cygpIHtcbiAgaWYgKGluc3RhbGxlZCkgcmV0dXJuXG4gIGNvbnN0IGluc3RhbmNlID0gZ2V0Q3VycmVudEluc3RhbmNlKClcbiAgaW5zdGFuY2UuYXBwQ29udGV4dC5hcHAudXNlKEVsZW1lbnRQbHVzKVxuICBpbnN0YWxsZWQgPSB0cnVlXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsb2FkU3R5bGUoKSB7XG4gIGNvbnN0IHN0eWxlcyA9IFsnaHR0cHM6Ly9jZG4uanNkZWxpdnIubmV0L25wbS9lbGVtZW50LXBsdXNAbGF0ZXN0L2Rpc3QvaW5kZXguY3NzJywgJ2h0dHBzOi8vY2RuLmpzZGVsaXZyLm5ldC9ucG0vZWxlbWVudC1wbHVzQGxhdGVzdC90aGVtZS1jaGFsay9kYXJrL2Nzcy12YXJzLmNzcyddLm1hcCgoc3R5bGUpID0+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpbmsnKVxuICAgICAgbGluay5yZWwgPSAnc3R5bGVzaGVldCdcbiAgICAgIGxpbmsuaHJlZiA9IHN0eWxlXG4gICAgICBsaW5rLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCByZXNvbHZlKVxuICAgICAgbGluay5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsIHJlamVjdClcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kKGxpbmspXG4gICAgfSlcbiAgfSlcbiAgcmV0dXJuIFByb21pc2UuYWxsU2V0dGxlZChzdHlsZXMpXG59XG4iLCJ0c2NvbmZpZy5qc29uIjoie1xuICBcImNvbXBpbGVyT3B0aW9uc1wiOiB7XG4gICAgXCJ0YXJnZXRcIjogXCJFU05leHRcIixcbiAgICBcImpzeFwiOiBcInByZXNlcnZlXCIsXG4gICAgXCJtb2R1bGVcIjogXCJFU05leHRcIixcbiAgICBcIm1vZHVsZVJlc29sdXRpb25cIjogXCJCdW5kbGVyXCIsXG4gICAgXCJ0eXBlc1wiOiBbXCJlbGVtZW50LXBsdXMvZ2xvYmFsLmQudHNcIl0sXG4gICAgXCJhbGxvd0ltcG9ydGluZ1RzRXh0ZW5zaW9uc1wiOiB0cnVlLFxuICAgIFwiYWxsb3dKc1wiOiB0cnVlLFxuICAgIFwiY2hlY2tKc1wiOiB0cnVlXG4gIH0sXG4gIFwidnVlQ29tcGlsZXJPcHRpb25zXCI6IHtcbiAgICBcInRhcmdldFwiOiAzLjNcbiAgfVxufVxuIiwiUGxheWdyb3VuZE1haW4udnVlIjoiPHNjcmlwdCBzZXR1cD5cbmltcG9ydCBBcHAgZnJvbSAnLi9BcHAudnVlJ1xuaW1wb3J0IHsgc2V0dXBFbGVtZW50UGx1cyB9IGZyb20gJy4vZWxlbWVudC1wbHVzLmpzJ1xuc2V0dXBFbGVtZW50UGx1cygpXG48L3NjcmlwdD5cblxuPHRlbXBsYXRlPlxuICA8QXBwIC8+XG48L3RlbXBsYXRlPlxuIiwiaW1wb3J0LW1hcC5qc29uIjoie1xuICBcImltcG9ydHNcIjoge1xuICAgIFwidnVlXCI6IFwiaHR0cHM6Ly9jZG4uanNkZWxpdnIubmV0L25wbS9AdnVlL3J1bnRpbWUtZG9tQGxhdGVzdC9kaXN0L3J1bnRpbWUtZG9tLmVzbS1icm93c2VyLmpzXCIsXG4gICAgXCJAdnVlL3NoYXJlZFwiOiBcImh0dHBzOi8vY2RuLmpzZGVsaXZyLm5ldC9ucG0vQHZ1ZS9zaGFyZWRAbGF0ZXN0L2Rpc3Qvc2hhcmVkLmVzbS1idW5kbGVyLmpzXCIsXG4gICAgXCJlbGVtZW50LXBsdXNcIjogXCJodHRwczovL2Nkbi5qc2RlbGl2ci5uZXQvbnBtL2VsZW1lbnQtcGx1c0BsYXRlc3QvZGlzdC9pbmRleC5mdWxsLm1pbi5tanNcIixcbiAgICBcImVsZW1lbnQtcGx1cy9cIjogXCJodHRwczovL2Nkbi5qc2RlbGl2ci5uZXQvbnBtL2VsZW1lbnQtcGx1c0BsYXRlc3QvXCIsXG4gICAgXCJAZWxlbWVudC1wbHVzL2ljb25zLXZ1ZVwiOiBcImh0dHBzOi8vY2RuLmpzZGVsaXZyLm5ldC9ucG0vQGVsZW1lbnQtcGx1cy9pY29ucy12dWVAMi9kaXN0L2luZGV4Lm1pbi5qc1wiXG4gIH0sXG4gIFwic2NvcGVzXCI6IHt9XG59IiwiX28iOnt9fQ==" />

```vue {7,22-24}
<template>
  <el-radio-group v-model="radio">
    <el-radio
      v-for="o in list"
      :key="o.value"
      v-bind="o"
      @click.prevent="handleRadioClick(o.value)"
    />
  </el-radio-group>
</template>

<script setup>
import { ref } from 'vue'

const radio = ref('')
const list = [
  { value: 'beijing', label: '北京' },
  { value: 'shanghai', label: '上海' },
  { value: 'shenzhen', label: '深圳' },
]

function handleRadioClick(val) {
  radio.value = radio.value === val ? null : val
}
</script>
```

### 方案二：新增一个空白 Radio

实际上没有“取消选择”，而是新增一个空白 Radio 标识“不选择”

```vue {4}
<template>
  <el-radio-group v-model="radio">
    <el-radio v-for="o in list" :key="o.value" v-bind="o" />
    <el-radio value="" label="空" />
  </el-radio-group>
</template>

<script setup>
import { ref } from 'vue'

const radio = ref('')
const list = [
  { value: 'beijing', label: '北京' },
  { value: 'shanghai', label: '上海' },
  { value: 'shenzhen', label: '深圳' },
]
</script>
```

### 对比

虽然方案二在视觉上增加了一个看似“冗余”的选项，但在交互设计和代码维护上，它才是更成熟的解决方案。

方案一（点击反选）的局限性：

- **违背用户心智模型**：单选框的语义是“互斥且必选其一”，默认 Radio 点击后无法取消，用户需要“猜”或“试”才知道这个 Radio 可以反选
- **状态表达含糊**：如果业务允许“不选”，那么“空值”本身就是一个合法的业务状态。将这个状态隐藏在“未选中”的视觉表现中，不如将其显式化更为直观

方案二（显式选项）的优势：

- **交互的确定性**：新增“不适用/无/空”选项，明确地告诉用户：“不选择”也是一种有效的选择，这符合系统状态可见性原则。
- **数据流清晰**：从数据层面看，Radio Group 应当始终映射一个确定的值。比通过 Hack 点击事件来置空数据，逻辑更加顺畅且易于维护。

综上，建议采取第二种方案。

如果业务场景确实需要“可取消”且不希望“空”选项，可能这里就不该用单选框，更规范的做法是改用 `Select` 选择器（带清除功能）。

## 替换方案

### 带清除功能的选择器

```vue
<template>
  <el-select v-model="select" clearable>
    <el-option v-for="o in list" :key="o.value" v-bind="o" />
  </el-select>
</template>

<script setup>
import { ref } from 'vue'

const select = ref('')
const list = [
  { value: 'beijing', label: '北京' },
  { value: 'shanghai', label: '上海' },
  { value: 'shenzhen', label: '深圳' },
]
</script>
```

### 重置表单

如果单选框是表单的一部分，且存在“重置表单”的按钮，也可以重置表单作为取消单选的辅助方案。虽然交互上比较糟糕，但也不违反用户直觉

```vue
<template>
  <el-form ref="formRef" :model="form" label-width="auto">
    <el-form-item label="城市" prop="radio">
      <el-radio-group v-model="form.radio">
        <el-radio v-for="o in list" :key="o.value" v-bind="o" />
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="() => formRef?.resetFields()">Reset</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { reactive, ref } from 'vue'

const form = reactive({ radio: '' })
const formRef = ref()
const list = [
  { value: 'beijing', label: '北京' },
  { value: 'shanghai', label: '上海' },
  { value: 'shenzhen', label: '深圳' },
]
</script>
```
