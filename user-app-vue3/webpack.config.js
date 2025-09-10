const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const { sentryWebpackPlugin } = require('@sentry/webpack-plugin');
const deps = require('./package.json').dependencies;

module.exports = {
    mode: 'development',
    entry: './src/main.ts', // Entry point is now TypeScript
    target: 'web',
    devServer: {
        port: 8081,
        hot: true,
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        clean: true,
        filename: '[name].[contenthash].js',
        publicPath: 'auto',
    },
    module: {
        rules: [
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                type: 'asset/resource', // Webpack 5's built-in asset module
                generator: {
                    filename: 'assets/images/[name].[hash][ext]', // Output path for images
                },
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
            },
            {
                test: /\.ts$/, // Rule for TypeScript files
                loader: 'ts-loader',
                options: {
                    appendTsSuffixTo: [/\.vue$/], // Process .vue files as TypeScript
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
                            // Explicitly target environments that support ES Modules and async/await
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
            name: 'userAppVue3',
            filename: 'remoteEntry.js',
            exposes: {
                './UserList': './src/pages/UserList.vue',
                './vue': 'vue',
            }
        }),
        sentryWebpackPlugin({
            org: 'mohit-personal',
            project: 'remote-app2',
            authToken: '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',
            moduleMetadata: ({ release }) => ({
                dsn: 'https://950341b3e4c5a23b3c3edb0a50a104b1@o4509507613425664.ingest.us.sentry.io/4509995671486464',
                module: 'remote-app2',
                release,
              }),
        }),
    ],
    resolve: {
        extensions: ['.ts', '.js', '.vue', '.json'], // Add .ts to extensions
    }
};
