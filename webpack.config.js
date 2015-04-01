module.exports = {
    entry: './src/jsx/app.jsx',
    output: {
        path: './assets/build',
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            { test: /\.jsx?$/, loader: 'jsx-loader?harmony' },
            { test: /\.scss$/, loader: 'style!css!sass' }
        ]
    }
}