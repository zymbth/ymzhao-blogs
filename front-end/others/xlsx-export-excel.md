---
description: xlsx导出excel功能封装，按需引入并可在vue等现代化框架中使用
head:
  - - meta
    - name: keywords
      content: xlsx,export,excel,vue,esm,按需引入
created: '2024-08-15'
---

# xlsx导出excel功能封装

> 参考：
>
> [sheetjs官网](https://sheetjs.com/)
>
> [官方文档](https://docs.sheetjs.com/docs/)

按需引入 xlsx 库，完全引入这个库的话还是挺大的

## 安装

```sh
# npm
npm install xlsx
# yarn
yarn add xlsx
# pnpm
pnpm add xlsx
```

## 封装及使用

[codepen 演示](https://codepen.io/zymbth/pen/xxopwLp)

::: code-group

```js [export2excel.js]
import { SSF, utils, writeFileXLSX } from 'xlsx'

function generateArray(table) {
  const out = []
  const rows = table.querySelectorAll('tr')
  const ranges = []
  for (let R = 0; R < rows.length; ++R) {
    const outRow = []
    const row = rows[R]
    const columns = row.querySelectorAll('td')
    for (let C = 0; C < columns.length; ++C) {
      const cell = columns[C]
      let colspan = cell.getAttribute('colspan')
      let rowspan = cell.getAttribute('rowspan')
      let cellValue = cell.textContent
      if (cellValue !== '' && cellValue == +cellValue) cellValue = +cellValue

      // Skip ranges
      ranges.forEach((range) => {
        if (
          R >= range.s.r
          && R <= range.e.r
          && outRow.length >= range.s.c
          && outRow.length <= range.e.c
        ) {
          for (let i = 0; i <= range.e.c - range.s.c; ++i) outRow.push(null)
        }
      })

      // Handle Row Span
      if (rowspan || colspan) {
        rowspan = rowspan || 1
        colspan = colspan || 1
        ranges.push({
          s: { r: R, c: outRow.length },
          e: { r: R + rowspan - 1, c: outRow.length + colspan - 1 }
        })
      }
      // Handle Value
      outRow.push(cellValue !== '' ? cellValue : null)

      // Handle Colspan
      if (colspan) {
        for (let k = 0; k < colspan - 1; ++k) outRow.push(null)
      }
    }
    out.push(outRow)
  }
  return [out, ranges]
}

function datenum(v, date1904) {
  if (date1904) v += 1462
  const epoch = Date.parse(v)
  return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000)
}

function sheet_from_array_of_arrays(data) {
  const ws = {}
  const range = { s: { c: 10000000, r: 10000000 }, e: { c: 0, r: 0 } }
  for (let R = 0; R != data.length; ++R) {
    for (let C = 0; C != data[R].length; ++C) {
      if (range.s.r > R) range.s.r = R
      if (range.s.c > C) range.s.c = C
      if (range.e.r < R) range.e.r = R
      if (range.e.c < C) range.e.c = C
      const cell = { v: data[R][C] }
      if (cell.v == null) continue
      const cell_ref = utils.encode_cell({ c: C, r: R })

      if (typeof cell.v === 'number') {
        cell.t = 'n'
      } else if (typeof cell.v === 'boolean') {
        cell.t = 'b'
      } else if (cell.v instanceof Date) {
        cell.t = 'n'
        cell.z = SSF._table[14]
        cell.v = datenum(cell.v)
      } else {
        cell.t = 's'
      }

      ws[cell_ref] = cell
    }
  }
  if (range.s.c < 10000000) ws['!ref'] = utils.encode_range(range)
  return ws
}

function Workbook() {
  if (!(this instanceof Workbook)) return new Workbook()
  this.SheetNames = []
  this.Sheets = {}
}

// function s2ab(s) {
//   const buf = new ArrayBuffer(s.length)
//   const view = new Uint8Array(buf)
//   for (let i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF
//   return buf
// }

export function export_table_to_excel(id) {
  const theTable = document.getElementById(id)
  const oo = generateArray(theTable)
  const ranges = oo[1]

  /* original data */
  const data = oo[0]
  const ws_name = 'SheetJS'

  const wb = new Workbook(),
    ws = sheet_from_array_of_arrays(data)

  /* add ranges to worksheet */
  // ws['!cols'] = ['apple', 'banan'];
  ws['!merges'] = ranges

  /* add worksheet to workbook */
  wb.SheetNames.push(ws_name)
  wb.Sheets[ws_name] = ws

  // var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: false, type: 'binary' });

  // saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), "test.xlsx")
  writeFileXLSX(wb, 'test.xlsx')
}

export function export_json_to_excel(th, jsonData, defaultTitle) {
  /* original data */

  const data = jsonData
  data.unshift(th)
  const ws_name = 'SheetJS'

  const wb = new Workbook(),
    ws = sheet_from_array_of_arrays(data)

  /* 设置worksheet每列的最大宽度 */
  const colWidth = data.map(row =>
    row.map((val) => {
      /* 先判断是否为null/undefined */
      if (val == null) {
        return { wch: 10 }
      } else if (val.toString().charCodeAt(0) > 255) {
        /* 再判断是否为中文 */
        return { wch: val.toString().length * 2 }
      } else {
        return { wch: val.toString().length }
      }
    })
  )
  /* 以第一行为初始值 */
  const result = colWidth[0]
  for (let i = 1; i < colWidth.length; i++) {
    for (let j = 0; j < colWidth[i].length; j++) {
      if (result[j].wch < colWidth[i][j].wch) {
        result[j].wch = colWidth[i][j].wch
      }
    }
  }
  ws['!cols'] = result

  /* add worksheet to workbook */
  wb.SheetNames.push(ws_name)
  wb.Sheets[ws_name] = ws

  // var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: false, type: 'binary' });
  const title = defaultTitle || 'excel-list'
  // saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), title + ".xlsx")
  writeFileXLSX(wb, `${title}.xlsx`)
}

export function export_jsons_to_excel(
  th1,
  jsonData1,
  th,
  jsonData,
  defaultTitle
) {
  /* original data */

  const data = jsonData
  data.unshift(th)
  data.unshift(jsonData1)
  data.unshift(th1)
  const ws_name = 'SheetJS'

  const wb = new Workbook(),
    ws = sheet_from_array_of_arrays(data)

  /* 设置worksheet每列的最大宽度 */
  const colWidth = data.map(row =>
    row.map((val) => {
      /* 先判断是否为null/undefined */
      if (val == null) {
        return { wch: 10 }
      } else if (val.toString().charCodeAt(0) > 255) {
        /* 再判断是否为中文 */
        return { wch: val.toString().length * 2 }
      } else {
        return { wch: val.toString().length }
      }
    })
  )
  /* 以第一行为初始值 */
  const result = colWidth[0]
  for (let i = 1; i < colWidth.length; i++) {
    for (let j = 0; j < colWidth[i].length; j++) {
      if (result[j].wch < colWidth[i][j].wch) {
        result[j].wch = colWidth[i][j].wch
      }
    }
  }
  ws['!cols'] = result

  /* add worksheet to workbook */
  wb.SheetNames.push(ws_name)
  wb.Sheets[ws_name] = ws

  // var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: false, type: 'binary' });
  const title = defaultTitle || 'excel-list'
  // saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), title + ".xlsx")
  writeFileXLSX(wb, `${title}.xlsx`)
}

/**
 * 表格导出
 *
 * @param {Array} columns 表格项列表 [{prop: 'name', label: '姓名'}, {prop: 'age', label: '年龄'}]
 * @param {Array} list 表格数据列表
 * @param {string} excelName 导出文件名
 * @param {boolean} isNestedQuery 是否分析prop，嵌套查询数据
 */
export function export2Excel(columns, list, excelName, isNestedQuery = false) {
  const labels = [] // 表头 ['姓名','年龄]
  const props = [] // 属性 ['name','age']
  columns.forEach((item) => {
    labels.push(item.label)
    props.push(item.prop)
  })
  // 获取导出数据: 遍历list，获取props
  const data = list.map(row =>
    props.map((prop) => {
      if (!isNestedQuery || !prop.includes('.')) {
        return row[prop]
      } else {
        // 嵌套查询
        let a = row
        const key = prop.split('.')
        for (let i = 0; i < key.length; i++) {
          a = a[key[i]]
        }
        return a
      }
    })
  )
  export_json_to_excel(labels, data, excelName)
}
```

```vue [demo1.vue]
<script setup>
import { ref } from "vue";
import { export2Excel } from "@/utils/export2excel.js";

const tableData = ref([
  { no: 1, code: "A", name: "张三", gender: "男", intro: "我是张三" },
  // ...
]);

const columns = [
  { label: "No.", prop: "no" },
  { label: "Code", prop: "code" },
  { label: "Name", prop: "name" },
  { label: "Gender", prop: "gender" },
  { label: "Intro", prop: "intro" }
];

function handleExport() {
  export2Excel(columns, tableData.value, "test-file");
}
</script>
<template>
  <h2>Export table to excel</h2>
  <button @click="handleExport">Export</button>
  <table><!-- ... --></table>
</template>
```

```vue [demo2.vue]
<script setup>
import { ref } from "vue";
import { export_json_to_excel } from "@/utils/export2excel.js";

const data = ref([
  [1,'A','张三','男','我是张三'],
  // ...
]);

const header = ['No.', 'Code', 'Name', 'Gender', 'Intro'];

function handleExport() {
  export_json_to_excel(header, data, "test-file");
}
</script>
<template>
  <h2>Export table to excel</h2>
  <button @click="handleExport">Export</button>
  <table><!-- ... --></table>
</template>
```

:::

封装方法中包含了多种场景下导出excel文件的功能
