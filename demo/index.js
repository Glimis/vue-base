const webpack = require('webpack')
const path = require('path')

const compiler = webpack({
    entry: path.resolve(__dirname, './test.columns'),
    module: {
        rules: [
            {
                test: /\.columns$/,
                use: {
                    loader: path.resolve(__dirname, "../index")
                }
            }
        ]
    }
});


compiler.run((error, stats) => {
    if (error) {
        console.log(error)
    } else {
        let v = stats.compilation['assets']['main.js']._value.match(/n.default=([^\]]*])/)[1]
        console.log(v)
    }
});