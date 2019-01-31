// This is a karma config file. For more details see
//   http://karma-runner.github.io/0.13/config/configuration-file.html
// we are also using it with karma-webpack
//   https://github.com/webpack/karma-webpack
const isTravisCI = 'TRAVIS' in process.env && 'CI' in process.env;

module.exports = function karmaConfig(config) {
    config.set({
        basePath: '',
        browsers: isTravisCI ? ['ChromeHeadlessNoSandbox'] : ['Chrome'],
        customLaunchers: {
            ChromeHeadlessNoSandbox: {
                base: 'ChromeHeadless',
                flags: ['--no-sandbox']
            }
        },
        frameworks: ['mocha'],
        // reporters: ['spec'],
        reporters: ['spec', 'coverage'],
        files: ['./**/*.spec.js'],
        preprocessors: {
            './**/*.spec.js': ['webpack'],
            '../src/*.js': ['coverage']
        },
        coverageReporter: {
            dir: './coverage',
            reporters: [{
                    type: 'lcov',
                    subdir: '.'
                },
                {
                    type: 'text-summary'
                }
            ]
        },
        autoWatch: true,
        port: 9876,
        colors: true,
        singleRun: !!isTravisCI,
        webpack: {
            mode: "development",
            module: {
                rules: [{
                        test: /\.js$/,
                        exclude: /node_modules/,
                        use: {
                            loader: 'babel-loader',
                            options: {
                                presets: ['@babel/preset-env','transform-vue-jsx'],
                                plugins: ['istanbul']
                            }

                        }
                    },
                    {
                        test: /\.vue$/,
                        loaders: ['vue-loader'],
                        exclude: /node_modules/,
                    }
                ]
            },
            resolve: {
                extensions: ['.js', '.vue'], //自动解析确定的扩展。默认值为  https://webpack.docschina.org/configuration/resolve#resolve-extensions
            }
        },
        webpackMiddleware: {
            noInfo: true
        }
    })
}