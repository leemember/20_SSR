const nodeExternals = require('webpack-node-externals');
const paths = require('./paths');
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent'); // CSS 모듈의 고유 className을 만들때 필요한 옵션
const webpack = require('webpack');
const getClientEnvironment = require('./env');

const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

const env = getClientEnvironment(paths.publicUrlOrPath.slice(0, -1));

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
                    //자바스크립트를 위한 처리
                    //기존 webpak.config.js를 참고하여 작성
                    {
                        test: /\.(js|mjs|jsx|ts|tsx)$/,
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
                                    onlyLocals:true
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
                            emitFile: false, //파일을 따로 저장하지 않는 옵션
                            limit: 10000, // 원래는 9.76KB가 넘어가면 파일로 저장하는데
                            //emitFile같이 false일 때는 경로만 준비하고 파일은 저장하지 않습니다.
                            name: 'static/media/[name].[hash:8].[ext]'
                        }
                    },
                    //위에서 설정된 확장자를 제외한 파일들은 file-loader를 사용한다.
                    {
                        loader: require.resolve('file-loader'),
                        exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/,/\.json$/],
                        options: {
                            emitFile: false, //파일을 따로 저장하지 않는 옵션
                            name: 'static/media/[name].[hash:8].[ext]'
                        }
                    }
                ]
            }            
        ]
    },
    resolve: {
        modules: ['node_modules']
    },
    /*
    이렇게 했을 때, react와 react-dom/server같은 라이브러리를 import 구문으로 불러오면 node-modules에서 찾아 사용한다.
    라이브러리를 불러오면 빌드할 때 결과물 파일 안에 해당 라이브러리 관련 코드가 함께 번들링된다.
    브라우저에서 사용할 때는 결과물 파일에 리액트 라이브러리와 우리의 애플리케이션에 관한 코드가 공존해야 하는데,
    서버에서는 굳이 결과물 파일 안에 리액트 라이브러리가 들어있지 않아도 된다.
    😁 node_modules를 통해 바로 불러와 사용할 수 있기 때문이다.
    */

    externals: [nodeExternals()],
    plugins: [
        new webpack.DefinePlugin(env.stringified)  
        //환경 변수를 주입해 줍니다.
    ]
};

