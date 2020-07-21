const loaderUtils = require("loader-utils");

module.exports = function (source) {
    return `export default ${JSON.stringify(run(source))}`;
}

function run(source) {


    // 1. 根据:进行分组
    let rows = source.split(/[(\r\n)\r\n]+/)
    // 分组,table系列切割
    let tables = [];

    let tableRows = [];

    if (rows && rows.length > 0) {
        rows.forEach(row => {
            // 认为为key 行
            if (row.match(/:\s*$/)) {
                if (tableRows.length > 0) {
                    tables.push(getColumns(tableRows))
                }
                tableRows = [row]
            } else {
                tableRows.push(row)
            }
        })
    }

    tables.push(getColumns(tableRows))

    if (tables.length == 1 && !tables[0].key) {
        return tables[0].value
    } else {
        let rs = {}
        tables.forEach(({ key, value }) => {
            rs[key] = value;
        })
        return rs;
    }

}

function getColumns(arr) {
    let firstText = arr[0].trim();
    if (firstText.match(/:/)) {
        return {
            key: firstText.slice(0, -1),
            value: _getColumns(arr.slice(1))
        }
    } else {
        return {
            value: _getColumns(arr)
        }
    }
}


function _getColumns(arr) {

    let columns = []

    // 1. 根据换行符切割,默认以第一行为准
    arr
        .map(rowText => rowText.trim())
        // 去除左右|
        .map(rowText => rowText.slice(1, -1))
        .map(
            rowText => rowText
                .split(/\|/)
                .map(cell => cell.trim())
        )
        .forEach(([key, ...values]) => {
            values.forEach((value, i) => {
                const column = columns[i] = columns[i] || {};
                if (value != '') setColumns(column, key, value)
            })
        });

    return columns
}

function setColumns(column, key, value) {
    if (key == 'params') {
        try {
            value = new Function(`return ${value}`)()
        } catch (error) {

        }
    }
    column[key] = value

}
