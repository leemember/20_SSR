const paths = require('./paths');
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent'); // CSS 모듈의 고유 className을 만들때 필요한 옵션

const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css&/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

module.exports = {
    mode: 'production', // 프로덕션 모드로 설정하여 최적화 옵션들 활성화
    entry: paths.ssrIndexJs, // 엔트리 경로
    target:'node', // node환경에서 실행될 것이라는 점을 명시
    output: {
        path: paths.ssrBuild,
        filename: 'server.js', // 빌드경로
        chunkFilename: 'js/[name].chunk.js', // 청크 파일 이름
        publicPath: paths.publicUrlOrPath, // 정적 파일이 제공될 경로

    },

    module: {
        rules: [
            {
                oneOf: [
                    //자바스크립트를 위한 처리 //
                    {
                        test: /\.(js|mjs|jsx|ts|tsx)$./,
                        include: paths.appSrc,
                        loader: require.resolve('babel-loader'),
                        options: {
                            customize: require.resolve(
                                'babel-preset-react-app/webpack-overrides'
                            ),
                            plugins: [
                                [
                                    require.resolve('babel-plugin-named-asset-import'),
                                    {
                                        loaderMap: {
                                            svg: {
                                                ReactComponent: '@svgr/webpack?-svgo![path]'
                                            }
                                        }
                                    }
                                ]
                            ],
                            cacheDirectory: true,
                            cacheCompression: false,
                            compact: false
                        }
                    },
                    //CSS를 위한 처리
                    {
                        test: cssRegex,
                        exclude: cssModuleRegex,
                        //exportOnlyLocals: true 옵션을 설정해야 실제 CSS 파일을 생성하지 않는다.
                        loader: require.resolve('css-loader'),
                        options: {
                            onlyLocals: true
                        }
                    },
                    //CSS 모듈을 위한 처리
                    {
                        test: cssModuleRegex,
                        loader: require.resolve('css-loader'),
                        options: {
                            modules:true,
                            onlyLocals: true,
                            getLocalIdent: getCSSModuleLocalIdent
                        }
                    },
                    //SASS를 위한 처리
                    {
                        test: sassRegex,
                        exclude: sassModuleRegex,
                        use: [
                            {
                                loader: require.resolve('css-loader'),
                                options: {
                                    onlyLocals:true,
                                }
                            },
                            require.resolve('sass-loader')
                        ]
                    },
                    //SASS + CSS Module을 위한 처리
                    {
                        test: sassRegex,
                        exclude: sassModuleRegex,
                        use: [
                            {
                                loader: require.resolve('css-loader'),
                                options: {
                                    modules: true,
                                    onlyLocals: true,
                                    getLocalIdent: getCSSModuleLocalIdent
                                }
                            },
                            require.resolve('sass-loader')
                        ]
                    },
                    // url-loader를 위한 설정
                    {
                        test: [/\.bmp$/, /\.gif$/, /\.jpg?g$/, /\.png$/],
                        loader: require.resolve('url-loader'),
                        options: {
                            emitFile: false,
                            limit: 10000,
                            name: 'static/media/[name].[hash:8].[ext]'
                        }
                    },
                    //위에서 설정된 확장자를 제외한 파일들은 file-loader를 사용한다.
                    {
                        loader: require.resolve('file-loader'),
                        exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/,/\.json$/],
                        options: {
                            emitFile: false,
                            name: 'static/media/[name].[hash:8].[ext]'
                        }
                    }
                ]
            }            
        ]
    }
};

