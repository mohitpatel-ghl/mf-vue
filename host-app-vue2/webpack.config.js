const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const deps = require('./package.json').dependencies;
const { sentryWebpackPlugin } = require('@sentry/webpack-plugin');

require('dotenv').config();
const webpack = require('webpack');

module.exports = {
    mode: 'development',
    entry: './src/main.js',
    target: 'web',
    devServer: {
        port: 8080,
        hot: true,
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
    },
    output: {
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: 'auto',
    },
    performance: {
        hints: false
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
        new webpack.DefinePlugin({
            'process.env': {
                USER_APP_URL: JSON.stringify(process.env.USER_APP_URL),
                EDIT_USER_APP_URL: JSON.stringify(process.env.EDIT_USER_APP_URL),
            },
        }),
        new VueLoaderPlugin(),
        new ModuleFederationPlugin({
            name: 'hostApp',
            filename: 'remoteEntry.js',
            remotes: {
                userAppVue3: `userAppVue3@${process.env.USER_APP_URL}/remoteEntry.js`,
                editUserAppVue3: `editUserAppVue3@${process.env.EDIT_USER_APP_URL}/remoteEntry.js`,
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
        sentryWebpackPlugin({
            authToken: process.env.SENTRY_AUTH_TOKEN,
            org: 'mohit-personal',
            project: 'host-app',
            debug: true,
            errorHandler: (err) => {
              console.warn("Sentry Error",err);
            },
            release: {
              setCommits: {
                auto: true,
              },
            },
          }),
    ],
};
