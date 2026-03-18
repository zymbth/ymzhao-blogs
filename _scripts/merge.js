import { execSync } from 'node:child_process'

// 封装执行命令的函数（带实时日志输出）
function runCommand(command) {
  console.log(`\n▶ 执行: ${command}`)
  execSync(command, { stdio: 'inherit' }) // stdio: 'inherit' 会将输出打印到当前终端
}

// 封装获取命令输出的函数
function getCommandOutput(command) {
  return execSync(command, { encoding: 'utf-8' }).trim()
}

function main() {
  try {
    // 1. 获取当前分支
    const currentBranch = getCommandOutput('git branch --show-current')

    // 2. 检测是否在 dev 分支
    if (currentBranch !== 'dev') {
      console.error(`\n❌ 错误: 当前在 "${currentBranch}" 分支。此命令只能在 "dev" 分支执行。`)
      process.exit(1)
    }

    // 3. (可选但强烈建议) 检测工作区是否有未提交的代码
    const hasUncommittedChanges = getCommandOutput('git status --porcelain') !== ''
    if (hasUncommittedChanges) {
      console.error('\n❌ 错误: 工作区有未提交的代码，请先 commit 或 stash 后再执行合并。')
      process.exit(1)
    }

    console.log('\n✅ 环境检测通过，开始自动化合并流程...')

    // 4. 依次执行 git 流程
    runCommand('git switch master')
    runCommand('git merge dev')
    runCommand('git push origin dev master') // 同时推送 dev 和 master
    runCommand('git switch dev')

    console.log('\n🎉 流程执行完毕！合并与推送成功，已切回 dev 分支。')
  } catch {
    // 如果中途报错（例如合并冲突、推送失败），脚本会捕获并在此时终止
    console.error('\n❌ 流程中断: 执行过程中发生错误，请检查终端报错信息解决后再试。')
    process.exit(1)
  }
}

main()
