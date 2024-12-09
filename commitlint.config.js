export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新功能(feature)
        'fix', // 修补bug
        'docs', // 文档(documentation)
        'style', // 格式、样式(不影响代码运行的变动)
        'refactor', // 重构(即不是新增功能，也不是修改BUG的代码)
        'perf', // 优化相关，比如提升性能、体验
        'test', // 添加测试
        'build', // 影响构建系统或外部依赖性的变化（示例范围：Gulp，Groccoli，NPM）
        'ci', // 持续集成修改
        'chore', // 构建过程或辅助工具的变动
        'revert', // 回滚到上一个版本
        // 'workflow', // 工作流改进
        // 'mod', // 不确定分类的修改
        // 'wip', // 开发中
        // 'types', // 类型修改
        // 'release' // 版本发布
      ]
    ],
    'subject-full-stop': [0, 'never'],
    'subject-case': [0, 'never']
  },
  prompt: {
    settings: {},
    messages: {
      skip: ':跳过', // ':skip',
      max: '最多 %d 字符', // 'upper %d chars',
      min: '最少 %d 字符', // '%d chars at least',
      emptyWarning: '不可为空', // 'can not be empty',
      upperLimitWarning: '超出限制', // 'over limit',
      lowerLimitWarning: '低于限制', // 'below limit'
    },
    questions: {
      type: {
        description: '选择要提交的类型:', // 'Select the type of change that you\'re committing:',
        enum: {
          feat: {
            description: '新增功能', // 'A new feature'
            title: 'Features',
            emoji: '✨',
          },
          fix: {
            description: '修复缺陷', // 'A bug fix'
            title: 'Bug Fixes',
            emoji: '🐛',
          },
          docs: {
            description: '仅文档更改', // 'Documentation only changes'
            title: 'Documentation',
            emoji: '📚',
          },
          style: {
            description: '不影响代码含义的更改(空格、格式化、缺少分号等)', // 'Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)'
            title: 'Styles',
            emoji: '💎',
          },
          refactor: {
            description: '重构(既不修复缺陷也不添加功能的代码更改)', // 'A code change that neither fixes a bug nor adds a feature'
            title: 'Code Refactoring',
            emoji: '📦',
          },
          perf: {
            description: '提高性能的代码更改', // 'A code change that improves performance'
            title: 'Performance Improvements',
            emoji: '🚀',
          },
          test: {
            description: '添加缺失的测试或修正现有的测试', // 'Adding missing tests or correcting existing tests'
            title: 'Tests',
            emoji: '🚨',
          },
          build: {
            description: '影响构建系统或外部依赖的更改(示例范围: gulp, broccoli, npm)', // 'Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)'
            title: 'Builds',
            emoji: '🛠',
          },
          ci: {
            description: '对 CI 配置文件和脚本的更改(示例范围: Travis, Circle, BrowserStack, SauceLabs)', // 'Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)'
            title: 'Continuous Integrations',
            emoji: '⚙️',
          },
          chore: {
            description: '不修改src或测试文件的其他更改', // 'Other changes that don't modify src or test files'
            title: 'Chores',
            emoji: '♻️',
          },
          revert: {
            description: '撤销之前的提交', // 'Reverts a previous commit'
            title: 'Reverts',
            emoji: '🗑',
          },
          // mod: {
          //   description: '不确定分类的修改',
          //   title: 'Mod',
          //   emoji: '📦',
          // },
          // wip: {
          //   description: '开发中',
          //   title: 'WIP',
          //   emoji: '⚠️',
          // },
          // types: {
          //   description: '类型修改',
          //   title: 'Types',
          //   emoji: '✏️',
          // },
        },
      },
      scope: {
        description: '此次更改的范围是什么(例如:组件或文件名)', // 'What is the scope of this change (e.g. component or file name)'
      },
      subject: {
        description: '写一个简短的、命令式语气的更改描述', // 'Write a short, imperative tense description of the change',
      },
      body: {
        description: '提供更详细的更改说明', // 'Provide a longer description of the change',
      },
      // isBreaking: {
      //   description: 'Are there any breaking changes?',
      // },
      // breakingBody: {
      //   description:
      //     'A BREAKING CHANGE commit requires a body. Please enter a longer description of the commit itself',
      // },
      // breaking: {
      //   description: 'Describe the breaking changes',
      // },
      // isIssueAffected: {
      //   description: 'Does this change affect any open issues?',
      // },
      // issuesBody: {
      //   description:
      //     'If issues are closed, the commit requires a body. Please enter a longer description of the commit itself',
      // },
      // issues: {
      //   description: 'Add issue references (e.g. "fix #123", "re #123".)',
      // },
    },
  }
}
