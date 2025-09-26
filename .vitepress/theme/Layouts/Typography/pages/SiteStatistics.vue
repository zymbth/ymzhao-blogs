<template>
  <h2>重置本站点统计数据</h2>
  <div class="csv-extractor">
    <div class="upload-area" @dragover.prevent @drop.prevent="handleDrop">
      <input
        type="file"
        accept=".csv"
        @change="handleFileSelect"
        ref="fileInput"
        class="file-input"
      />
      <button @click="$refs.fileInput.click()" class="upload-button">
        选择 CSV 文件
      </button>
      <p class="hint">
        或拖拽 CSV 文件到此区域
      </p>
    </div>

    <!-- 结构化数据表格 -->
    <div v-if="processedData.length > 0" class="table-container">
      <table class="data-table">
        <colgroup>
          <col width="60%" />
          <col width="15%" />
          <col width="15%" />
          <col width="10%" />
        </colgroup>
        <thead>
          <tr>
            <th>网页路径和屏幕类</th>
            <th>浏览次数</th>
            <th>活跃用户</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in processedData" :key="index">
            <td>{{ row[0] }}</td>
            <td>{{ row[1] }}</td>
            <td>{{ row[2] }}</td>
            <td>
              <a class="primary-link" @click="removeRow(index)">
                删除
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-if="processedData.length > 0">
      总计 {{ processedData.length }} 条数据
    </p>

    <!-- 底部操作按钮 -->
    <div v-if="processedData.length > 0" class="action-buttons">
      <button @click="clearAll" class="clear-button">
        清空
      </button>
      <button @click="confirmData" class="confirm-button">
        确定
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const HOST_NAME = 'blog.ymzhao.work'
const fileInput = ref(null)
const processedData = ref([])

// 处理文件选择
const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file && file.name.endsWith('.csv')) {
    readFile(file)
  }
}

// 处理拖拽上传
const handleDrop = (event) => {
  const file = event.dataTransfer.files[0]
  if (file && file.name.endsWith('.csv')) {
    readFile(file)
  }
}

const getNumber = (n) => {
  const r = Number(n)
  if (Number.isNaN(r)) return 0
  return r
}

// 读取并处理 CSV 文件
const readFile = (file) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    const rawContent = e.target.result
    // 移除注释行（以 # 开头）
    const lines = rawContent.split('\n')
    const filteredLines = lines.filter((line) => {
      const trimmed = line.trim()
      return !trimmed.startsWith('#')
    }).filter(line => line.trim() !== '') // 过滤空行

    // 数据处理
    try {
      const list = filteredLines
        .map(l => l.split(','))
        .slice(1) // 跳过标题行
        .map(l => [l[0]?.replaceAll('"', '') || '', ...l.slice(1)])
        .filter(l =>
          l[0] === '/'
          || ['/back-end', '/front-end', '/server-end', '/snippets', '/study', '/portfolio']
            .some(p => l[0].startsWith(p))
        )
        .toSorted((a, b) => a[0].localeCompare(b[0]))
        .map((p) => {
          return [p[0], getNumber(p[1]), getNumber(p[2])]
        })

      // 合并重复路径
      for (let i = list.length - 1; i > 0; i--) {
        if (list[i][0] !== `${list[i - 1][0]}/`) continue
        list[i - 1][1] += list[i][1]
        list[i - 1][2] += list[i][2]
        list.splice(i, 1)
        i--
      }

      processedData.value = list
    } catch (error) {
      console.error('处理 CSV 数据时出错:', error)
      processedData.value = []
    }
  }
  reader.onerror = () => {
    console.error('读取文件失败')
    processedData.value = []
  }
  reader.readAsText(file, 'utf-8')
}

// 删除指定行
const removeRow = (index) => {
  processedData.value.splice(index, 1)
}

// 清空所有内容
const clearAll = () => {
  processedData.value = []
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// 确认数据（预留接口调用）
const confirmData = () => {
  const data = processedData.value.map((p) => {
    return {
      host: HOST_NAME,
      path: p[0],
      count: p[1],
    }
  })
  fetch('https://api-site-statistics.ymzhao.work/api/init', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(res => res.json())
    .then((res) => {
      console.log('重置成功:', res)
    })
    .catch((err) => {
      console.warn('重置失败:', err)
    })
}
</script>

<style scoped>
.upload-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 2rem;
  border: 2px dashed var(--tg-bg-color-3);
  border-radius: 8px;
  background-color: var(--tg-bg-color-1);
  transition: background-color 0.3s;
}

.upload-area:hover {
  background-color: var(--tg-bg-color-2);
}

.file-input {
  display: none;
}

.upload-button {
  padding: 0.75rem 1.5rem;
  background-color: var(--tg-txt-color);
  color: var(--tg-bg-color);
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.upload-button:hover {
  background-color: var(--tg-txt-color-2);
}

.hint {
  margin-top: 1rem;
  color: var(--tg-txt-color-2);
  font-size: 0.9rem;
}

.table-container {
  width: 100%;
  margin-top: 20px;
  max-height: 500px;
  overflow-x: auto;
}

.data-table {
  width: 100%;
  font-size: 12px;
  line-height: 1.4em;
  border-collapse: collapse;
  background-color: var(--tg-bg-color);
  border: 1px solid var(--tg-bg-color-2);
}

.data-table th,
.data-table td {
  padding: 4px 8px;
  text-align: left;
  border-bottom: 1px solid var(--tg-bg-color-2);
}

.data-table th {
  background-color: var(--tg-bg-color-1);
  font-weight: 600;
}

.data-table tbody tr:hover {
  background-color: var(--tg-bg-color-2);
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
}

.clear-button,
.confirm-button {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.clear-button {
  background-color: var(--tg-bg-color);
  border: 1px solid var(--tg-bg-color-3);
}

.clear-button:hover {
  background-color: var(--tg-bg-color-2);
}

.confirm-button {
  background-color: var(--tg-txt-color);
  color: var(--tg-bg-color);
  border: none;
}

.confirm-button:hover {
  background-color: var(--tg-txt-color-2);
}
</style>
