const { override, fixBabelImports, addLessLoader } = require('customize-cra');

module.exports = override(
    fixBabelImports('babel-plugin-import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true
    }),
    addLessLoader({
        lessOptions: {
            javascriptEnabled: true,
            modifyVars: { '@primary-color': 'orange' }
        }
    })
);
