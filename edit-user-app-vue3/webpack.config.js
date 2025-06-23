const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const deps = require('./package.json').dependencies;

module.exports = {
    mode: 'production',
    entry: './src/main.ts',
    target: 'web',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[contenthash].js',
        clean: true,
        publicPath: 'auto',
    },
    module: {
        rules: [
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/images/[name].[hash][ext]',
                },
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
            },
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                options: {
                    appendTsSuffixTo: [/\.vue$/],
                },
                exclude: /node_modules/,
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                options: {
                    presets: [
                        ['@babel/preset-env', {
                            targets: {
                                esmodules: true
                            }
                        }]
                    ]
                }
            },
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                ],
            },
        ],
    },
    plugins: [
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'public/index.html'),
            inject: true,
            templateParameters: {
                BASE_URL: '/',
            },
        }),
        new ModuleFederationPlugin({
            name: 'editUserAppVue3',
            filename: 'remoteEntry.js',
            exposes: {
                './EditUser': './src/pages/EditUser.vue',
                './AddUser': './src/pages/AddUser.vue',
                './vue': 'vue',
            }
        }),
    ],
    resolve: {
        extensions: ['.ts', '.js', '.vue', '.json'], // Add .ts to extensions
    }
};
