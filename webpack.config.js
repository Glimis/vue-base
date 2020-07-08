var path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin')  

module.exports = {
    mode:'development',
    entry:  path.resolve(__dirname,'./index.js'),
    devServer: {
      host:'0.0.0.0',
      port:8080
    },
    output: {
        path: path.resolve(__dirname,'dist'),
        filename: 'app.js'
    },
    module: {
      rules:[
        {
            test:/\.vue$/,
            loader:'vue-loader'
        },
        {
            test: /\.(png|jpg|gif)$/,
            use: [
              {
                loader: 'file-loader',
                options: {
                  esModule: false,
                },
              }
            ]
        },{
          test: /\.less$/,
          use: [
            'vue-style-loader',
            'css-loader',
            'less-loader'
          ]
        }
      ]
    },
    plugins: [
      new VueLoaderPlugin() ,
      // require('postcss-pxtorem')({
      //   rootValue: 50, // 换算的基数
      //   selectorBlackList: ['weui', 'mu', '-px'], // 忽略转换正则匹配项
      //   propList: ['*']
      // })
    ]
};