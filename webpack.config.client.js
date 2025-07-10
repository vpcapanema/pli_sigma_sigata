const path = require('path');
const fs = require('fs');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

// Função para descobrir módulos automaticamente
function discoverModules() {
  const modulesPath = path.resolve(__dirname, 'src/modules');
  const modules = {};

  if (fs.existsSync(modulesPath)) {
    const moduleNames = fs.readdirSync(modulesPath);

    moduleNames.forEach(moduleName => {
      const modulePath = path.join(modulesPath, moduleName);
      const jsPath = path.join(modulePath, 'js');
      const cssPath = path.join(modulePath, 'css');

      // Verificar se tem arquivos JS
      if (fs.existsSync(jsPath)) {
        const jsFiles = fs.readdirSync(jsPath).filter(file => file.endsWith('.js'));
        jsFiles.forEach(file => {
          const entryName = `${moduleName}-${file.replace('.js', '')}`;
          modules[entryName] = path.join(jsPath, file);
        });
      }

      // Verificar se tem arquivos CSS
      if (fs.existsSync(cssPath)) {
        const cssFiles = fs.readdirSync(cssPath).filter(file => file.endsWith('.css'));
        cssFiles.forEach(file => {
          const entryName = `${moduleName}-${file.replace('.css', '')}-css`;
          modules[entryName] = path.join(cssPath, file);
        });
      }
    });
  }

  return modules;
}

// Função para criar plugins HTML para cada módulo
function createHtmlPlugins() {
  const modulesPath = path.resolve(__dirname, 'src/modules');
  const plugins = [];

  if (fs.existsSync(modulesPath)) {
    const moduleNames = fs.readdirSync(modulesPath);

    moduleNames.forEach(moduleName => {
      const modulePath = path.join(modulesPath, moduleName);
      const templatesPath = path.join(modulePath, 'templates');

      if (fs.existsSync(templatesPath)) {
        const templateFiles = fs.readdirSync(templatesPath).filter(file => file.endsWith('.html'));

        templateFiles.forEach(file => {
          const fileName = file.replace('.html', '');
          const templatePath = path.join(templatesPath, file);

          plugins.push(
            new HtmlWebpackPlugin({
              template: templatePath,
              filename: `${moduleName}/${fileName}.html`,
              chunks: [
                'runtime',
                'vendors',
                'common',
                'shared',
                `${moduleName}-${fileName}`,
                `${moduleName}-${fileName}-css`
              ],
              inject: 'body',
              minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true
              }
            })
          );
        });
      }
    });
  }

  return plugins;
}

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  const isDevelopment = !isProduction;

  // Descobrir módulos automaticamente
  const moduleEntries = discoverModules();

  const entry = {
    // CSS compartilhado
    shared: './src/shared/css/global.css',
    // Módulos descobertos automaticamente
    ...moduleEntries
  };

  return {
    entry,
    output: {
      filename: 'js/[name].[contenthash].js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/',
      clean: true
    },
    // Especifica que é para o browser
    target: 'web',
    resolve: {
      extensions: ['.js', '.json', '.css'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@shared': path.resolve(__dirname, 'src/shared'),
        '@modules': path.resolve(__dirname, 'src/modules')
      }
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  {
                    targets: {
                      browsers: ['> 1%', 'last 2 versions', 'not ie <= 8']
                    },
                    modules: false
                  }
                ]
              ],
              plugins: ['@babel/plugin-transform-runtime']
            }
          }
        },
        {
          test: /\.css$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
            'postcss-loader'
          ]
        },
        {
          test: /\.(png|jpe?g|gif|svg|ico)$/,
          type: 'asset/resource',
          generator: {
            filename: 'images/[name].[hash][ext]'
          }
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[name].[hash][ext]'
          }
        }
      ]
    },
    plugins: [
      new CleanWebpackPlugin(),

      // CSS extraction para produção
      ...(isProduction
        ? [
          new MiniCssExtractPlugin({
            filename: 'css/[name].[contenthash].css',
            chunkFilename: 'css/[id].[contenthash].css'
          })
        ]
        : []),

      // HTML plugins para cada módulo
      ...createHtmlPlugins(),

      // Copy static assets se existirem
      ...(fs.existsSync(path.resolve(__dirname, 'public'))
        ? [
          new CopyWebpackPlugin({
            patterns: [
              {
                from: path.resolve(__dirname, 'public'),
                to: path.resolve(__dirname, 'dist'),
                globOptions: {
                  ignore: ['**/index.html']
                }
              }
            ]
          })
        ]
        : []),

      // Bundle analyzer para produção
      ...(isProduction
        ? [
          new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            openAnalyzer: false,
            reportFilename: 'bundle-report.html'
          })
        ]
        : [])
    ],
    optimization: {
      minimize: isProduction,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: isProduction
            },
            format: {
              comments: false
            }
          },
          extractComments: false
        }),
        new CssMinimizerPlugin()
      ],
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 5,
            reuseExistingChunk: true
          }
        }
      },
      runtimeChunk: 'single'
    },
    devtool: isDevelopment ? 'eval-source-map' : 'source-map',
    devServer: {
      static: {
        directory: path.join(__dirname, 'dist')
      },
      compress: true,
      port: 3001,
      open: true,
      hot: true,
      historyApiFallback: true
    },
    performance: {
      hints: isProduction ? 'warning' : false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000
    }
  };
};
