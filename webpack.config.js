module.exports = {
    entry: './src/js/app.jsx',
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