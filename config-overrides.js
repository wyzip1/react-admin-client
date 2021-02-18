const { override, fixBabelImports, addLessLoader } = require('customize-cra');

module.exports = override(
    fixBabelImports('babel-plugin-import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        // style: true
        style: 'css'
    }),
    // addLessLoader({
    //     lessOptions: {
    //         javascriptEnabled: true,
    //         modifyVars: { '@primary-color': '#66cc99' }
    //     }
    // })
);
