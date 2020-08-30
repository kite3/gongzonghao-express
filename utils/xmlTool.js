const xml2js = require('xml2js')

function toJSON(xml) {
  return new Promise((resolve, reject) => {
    const xmlParser = new xml2js.Parser({
      explicitArray: false, // xml2js默认会把子节点的值转为数组，这里设置false
      ignoreAttrs: true //忽略xml属性，仅创建文本
    })
    xmlParser.parseString(xml, (err, data) => {
      if (err) {
        reject(err)
        return
      }
      resolve(data)
    })
  })
}

function toXML(obj) {
  const builder = new xml2js.Builder()
  return builder.buildObject(obj)
}

module.exports = {
  toJSON,
  toXML
}
