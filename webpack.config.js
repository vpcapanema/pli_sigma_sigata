const path = require('path');
const fs = require('fs');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

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
      const templatesPath = path.join(modulesPath, moduleName, 'templates');

      if (fs.existsSync(templatesPath)) {
        const templateFiles = fs.readdirSync(templatesPath).filter(file => file.endsWith('.html'));

        templateFiles.forEach(file => {
          plugins.push(
            new HtmlWebpackPlugin({
              template: path.join(templatesPath, file),
              filename: `modules/${moduleName}/${file}`,
              chunks: [`${moduleName}-${file.replace('.html', '')}`, `${moduleName}-css`, 'shared'],
              minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true
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

  // Descobrir módulos automaticamente
  const moduleEntries = discoverModules();

  const config = {
    mode: isProduction ? 'production' : 'development',

    entry: {
      // Arquivo principal
      main: './server.js',

      // Shared utilities
      shared: [
        './src/shared/utils/api.js',
        './src/shared/utils/helpers.js',
        './src/shared/css/global.css'
      ],

      // Módulos descobertos automaticamente
      ...moduleEntries
    },

    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProduction ? 'js/[name].[contenthash].js' : 'js/[name].js',
      chunkFilename: isProduction ? 'js/[name].[contenthash].chunk.js' : 'js/[name].chunk.js',
      publicPath: '/',
      clean: true
    },

    module: {
      rules: [
        // JavaScript
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: ['@babel/plugin-transform-runtime']
            }
          }
        },

        // CSS
        {
          test: /\.css$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
            'postcss-loader'
          ]
        },

        // Imagens
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'images/[name].[hash][ext]'
          }
        },

        // Fontes
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[name].[hash][ext]'
          }
        }
      ]
    },

    plugins: [
      // Limpeza do diretório de saída
      new CleanWebpackPlugin(),

      // Extração de CSS
      new MiniCssExtractPlugin({
        filename: isProduction ? 'css/[name].[contenthash].css' : 'css/[name].css',
        chunkFilename: isProduction ? 'css/[name].[contenthash].css' : 'css/[name].css'
      }),

      // Cópia de arquivos estáticos
      new CopyWebpackPlugin({
        patterns: [
          {
            from: 'public',
            to: 'public',
            globOptions: {
              ignore: ['**/*.DS_Store']
            }
          },
          {
            from: 'src/modules/*/templates/*.html',
            to: 'templates/[name][ext]',
            globOptions: {
              ignore: ['**/node_modules/**']
            }
          }
        ]
      }),

      // Plugins HTML para cada módulo
      ...createHtmlPlugins()
    ],

    optimization: {
      minimize: isProduction,
      minimizer: [
        // Minificação de JavaScript
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: isProduction,
              drop_debugger: isProduction
            },
            mangle: {
              safari10: true
            }
          }
        }),

        // Minificação de CSS
        new CssMinimizerPlugin()
      ],

      // Divisão de código
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          // Vendor chunks
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 10,
            reuseExistingChunk: true
          },

          // Shared chunks
          shared: {
            name: 'shared',
            minChunks: 2,
            priority: 5,
            reuseExistingChunk: true
          },

          // CSS chunks
          styles: {
            name: 'styles',
            test: /\.css$/,
            chunks: 'all',
            enforce: true
          }
        }
      },

      // Runtime chunk
      runtimeChunk: {
        name: 'runtime'
      }
    },

    resolve: {
      extensions: ['.js', '.json'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@shared': path.resolve(__dirname, 'src/shared'),
        '@modules': path.resolve(__dirname, 'src/modules'),
        '@config': path.resolve(__dirname, 'config')
      }
    },

    devtool: isProduction ? 'source-map' : 'eval-source-map',

    devServer: {
      contentBase: path.resolve(__dirname, 'dist'),
      historyApiFallback: true,
      hot: true,
      port: 3001,
      proxy: {
        '/api': 'http://localhost:3000'
      }
    },

    stats: {
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }
  };

  // Configurações específicas para produção
  if (isProduction) {
    config.plugins.push(
      // Análise de bundle
      new (require('webpack-bundle-analyzer').BundleAnalyzerPlugin)({
        analyzerMode: 'static',
        openAnalyzer: false,
        reportFilename: 'bundle-report.html'
      })
    );
  }

  return config;
};
