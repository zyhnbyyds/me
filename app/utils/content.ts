/**
 * 将内容ID转换为数据字段对象
 *
 * 此函数接受一个字符串格式的内容ID，将其分割成三个部分：
 * 文件目录名、类别和文件名，然后返回一个包含这些字段的对象
 * 这种转换便于后续处理中更直观地访问和操作这些数据
 *
 * @param id 内容ID，格式为`文件目录名:类别:文件名`
 * @returns 返回一个对象，包含文件目录名、类别和文件名
 */
export function transformContentIdToDataField(id: string) {
  const [fileDirName, category, fileName] = id.split(':')

  return {
    fileDirName,
    category,
    fileName,
  }
}
