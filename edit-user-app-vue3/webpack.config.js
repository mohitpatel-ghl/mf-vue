const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const { sentryWebpackPlugin } = require('@sentry/webpack-plugin');
const deps = require('./package.json').dependencies;

module.exports = {
    mode: 'development',
    entry: './src/main.ts',
    target: 'web',
    devServer: {
        port: 8082,
        hot: true,
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
    },
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
        sentryWebpackPlugin({
            authToken: "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",
            org: 'mohit-personal',
            project: 'remote-app1',
            moduleMetadata: ({ release }) => ({
              dsn: 'https://b3528beb31c385bc32b08340bec04953@o4509507613425664.ingest.us.sentry.io/4509995656282112',
              module: 'remote-app1',
              release,
            }),
          }),
    ],
    resolve: {
        extensions: ['.ts', '.js', '.vue', '.json'], // Add .ts to extensions
    }
};
