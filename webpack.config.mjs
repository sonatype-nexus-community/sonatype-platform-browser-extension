/*
 * Copyright (c) 2019-present Sonatype, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import path from 'path'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import CspHtmlWebpackPlugin from 'csp-html-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'

import pkgJson from './package.json' with { type: "json" }

const cspPlugin = new CspHtmlWebpackPlugin({
  'base-uri': "'self'",
  'object-src': "'none'",
  'script-src': ["'unsafe-inline'", "'self'", "'unsafe-eval'"],
  'style-src': ["'unsafe-inline'", "'self'", "'unsafe-eval'"]
},
{
  hashingMethod: 'sha256',
  hashEnabled: {
    'script-src': true,
    'style-src': true
  },
  nonceEnabled: {
    'script-src': true,
    'style-src': false
  }
})

export default [
  // Service Worker
  {
    devtool: 'inline-source-map',
    entry: {
      service: './src/service/index.ts'
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          loader: 'ts-loader',
          options: {
            configFile: 'tsconfig.service.json'
          }
        }
      ]
    },
    optimization: {
      minimize: false,
      runtimeChunk: false,
    },
    output: {
      globalObject: 'this',
      path: path.resolve("build")
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.json'],
      fallback: {
        "net": false,
        "tls": false,
      }
    }
  },

  // Everything bar Service Worker
  {
    devtool: 'cheap-module-source-map',
    entry: {
      content: './src/content/index.ts',
      options: './src/options/index.tsx',
      popup: './src/popup/index.tsx',
      sidePanel: './src/side-panel/index.tsx',
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.(scss|css)$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
        },
        {
          test: /\.(ttf|eot|woff2?|svg|png|json)$/,
          type: 'asset'
        }
      ],
    },
    optimization: {
      minimize: false,
      runtimeChunk: false,
    },
    output: {
      // globalObject: 'this',
      path: path.resolve("build")
    },
    plugins: [
      // Copy / Generate HTML file: options.html
      new HtmlWebpackPlugin({
        chunks: ['options'],
        filename: 'options.html',
        inject: true,
        template: path.resolve('src/public/template.html')
      }),
      // Copy / Generate HTML file: popup.html
      new HtmlWebpackPlugin({
        chunks: ['popup'],
        filename: 'popup.html',
        inject: true,
        template: path.resolve('src/public/template.html')
      }),
      // Copy / Generate HTML file: side-panel.html
      new HtmlWebpackPlugin({
        chunks: ['sidePanel'],
        filename: 'side-panel.html',
        inject: true,
        template: path.resolve('src/public/template.html')
      }),
      // CSP Plugin
      cspPlugin,
      // Copy manifest.json and set version inside it
      new CopyWebpackPlugin({
        patterns: [
          {
            from: 'src/public/manifest.json',
            transform (content) {
              let manifest = JSON.parse(content.toString())
              manifest.version = pkgJson.version
              return JSON.stringify(manifest, null, 2)
            }
          }
        ]
      }),
      // CSS / SCSS
      new MiniCssExtractPlugin({
        filename: 'static/css/[name].css',
        chunkFilename: 'static/css/[name].css',
      }),
      // Copy Images / Locales
      new CopyWebpackPlugin({
        patterns: [
          {
            from: 'src/public',
            globOptions: {
              dot: true,
              gitignore: true,
              ignore: [
                "**/*.html", "**/manifest.json"
              ],
            },
          }
        ]
      })
    ],
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.json'],
      fallback: {
        "net": false,
        "tls": false,
      }
    }
  }
]