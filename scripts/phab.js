const fs = require('fs-extra')
const path = require('path')
const execSync = require('child_process').execSync

const temp = path.join(__dirname, 'tmp')
const hugswapBuild = path.join(__dirname, '../../hugswap-build')
const build = path.join(__dirname, '../build')
const gitPath = path.join(hugswapBuild, '.git')
console.log('开始build')
// execSync("npm run build")
console.log('build结束')
execSync(`
cd ${hugswapBuild}
git pull --all
`)
fs.copySync(gitPath, temp)
fs.emptyDirSync(hugswapBuild)
fs.copySync(temp, gitPath)
fs.copySync(build, hugswapBuild)
console.log('copy结束')
execSync(`
cd ${hugswapBuild}
git add .
git commit -m 'build'
git push
`)
console.log('提交git结束')
fs.removeSync(temp)