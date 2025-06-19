const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const deps = require('./package.json').dependencies;

module.exports = {
    mode: 'development',
    entry: './src/main.js',
    devServer: {
        port: 8080,
        hot: true,
        static: {
            directory: path.join(__dirname, 'dist'), // Serve static files from dist directory
        },
        headers: {
            "Access-Control-Allow-Origin": "*", // Allow CORS for cross-origin loading
        },
    },
    output: {
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: 'http://localhost:8080/',
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'), // 👈 this is the fix
            'vue$': 'vue/dist/vue.esm.js' // Use the full build of Vue
        },
        extensions: ['.js', '.vue'],
    },
    module: {
        rules: [
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                type: 'asset/resource', // ⬅️ this emits files to output dir and returns a URL
            },
            { test: /\.vue$/, loader: 'vue-loader' },
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader', // 👈 injects styles into DOM
                    'css-loader',       // 👈 interprets @import and url()
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
                    eager: true,
                    requiredVersion: deps.vue
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
