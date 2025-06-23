const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const deps = require('./package.json').dependencies;

module.exports = {
    mode: 'development',
    entry: './src/main.js',
    target: 'web',
    devServer: {
        port: 8080,
        hot: true,
        static: {
            directory: path.join(__dirname, 'dist'), 
        },
        headers: {
            "Access-Control-Allow-Origin": "*", 
        },
    },
    output: {
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: 'http://localhost:8080/',
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'), 
            'vue$': 'vue/dist/vue.esm.js' 
        },
        extensions: ['.js', '.vue'],
    },
    module: {
        rules: [
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                type: 'asset/resource',
            },
            { test: /\.vue$/, loader: 'vue-loader' },
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader', 
                    'css-loader',       
                ],
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                options: {
                    presets: [
                        ['@babel/preset-env', {
                            // Explicitly target environments that support ES Modules and async/await
                            targets: {
                                esmodules: true
                            }
                        }]
                    ]
                }
            },
        ],
    },
    plugins: [
        new VueLoaderPlugin(),
        new ModuleFederationPlugin({
            name: 'hostApp',
            filename: 'remoteEntry.js',
            remotes: {
                userAppVue3: 'userAppVue3@http://localhost:8081/remoteEntry.js',
                editUserAppVue3: 'editUserAppVue3@http://localhost:8082/remoteEntry.js',
            },
            exposes: {
                // Expose the store adapter
                './store-adapter': './src/store/store-adapter.js',
            },
            shared: {
                vue: {
                    singleton: true,
                    eager: true,
                    requiredVersion: deps.vue
                },
                vuex: {
                    singleton: true,
                    requiredVersion: deps.vuex,
                    eager: true
                }
            }
        }),
        new HtmlWebpackPlugin({
            template: './public/index.html',
            inject: true,
            templateParameters: {
                BASE_URL: '/',
            },
        }),
    ],
};
