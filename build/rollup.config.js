export default {
    entry: 'build_tmp/fx/module.js',
    format: 'umd',
    dest: 'package/oc-widgets.umd.js',
    moduleName: "t-rex",
    external: [
        'tslib',
        '@angular/core',
    ]
};
