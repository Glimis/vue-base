const { getOptions } = require('loader-utils')

const { lexer, parser } = require('markdown2json_core')

module.exports = function (source) {
    const options = getOptions(this);
    // 格式转换 --》 只包含基础类型
    const dataType = options.data || {
        value: Number
    }

    let tokens = lexer(source)
    let ast = parser(tokens) || [{ node: [] }]
    let rs
    // ast 中,json 与table 只有一个
    ast.forEach(({ type, node }) => {
        if (type == 'json') {
            rs = rs || {}
            rs[node.key.trim()] = getJSON(node.table, dataType)
        } else {
            rs = getJSON(node, dataType)
        }
    })

    return `export default ${JSON.stringify(rs)}`
}
function getJSON(rows = [], dataType) {
    if (rows.length == 0) {
        return {}
    }

    // 第一行为key,剩下的为value
    let header = rows.shift().map(name => name.trim())
    let rs = []
    rows.forEach(row => {
        let json = {}
        header.forEach((headerName, i) => {
            let v = row[i].trim()
            if (v) {
                // 类型转换
                let type = dataType[headerName]

                if (type === Boolean) {
                    _.set(json, headerName, v != 'false')
                } else if (type === Number) {
                    _.set(json, headerName, Number(v))
                } else if (type === Object) {
                    try {
                        value = new Function(`return ${v}`)()
                        _.set(json, headerName, value)
                    } catch (error) {

                    }

                } else {
                    _.set(json, headerName, v)
                }
            }
        })
        rs.push(json)
    })

    return rs
}



const _ = {
    /**
     * key 可以使用.进行对象属性设置
     * data中key，不包含.
     */
    set(data, key = '', value) {
        let arr = key.split('.');
        let lastName = arr.pop();

        arr.forEach((name) => {
            data && (data = data[name]);
        });
        if (data) {
            data[lastName] = value;
        }
    }
};