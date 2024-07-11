/**
 * 检测到没有安装 7z 时的提示信息
 */
export function install7zip() {
    console.log("检测到您的系统没有安装 7z，请先安装 7z 后再执行")
    console.log("下载地址：https://www.7-zip.org/download.html")
    console.log("如果已经安装，请按照以下步骤将 7z 添加到环境变量中")
    console.log("1. 设置 → 系统 → 右侧系统信息 → 高级系统设置 → 环境变量")
    console.log("2. 在系统变量中找到并选中 Path，点击编辑")
    console.log("3. 点击新建，输入 7z 的安装路径（默认是 C:\\Program Files\\7-Zip），点击确定")
    console.log("4. 重启终端，输入 7z，如果出现 7z 的版本信息，则安装成功")
    console.log("5. 如果没有出现版本信息，请重启电脑，或者检查 7z 的安装路径是否正确")
}
