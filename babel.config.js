module.exports = {
    presets: [
        ['@babel/preset-env', {
            targets: {
                node: 'current',
            },
            modules: 'auto' // 'auto' should be sufficient if your environment supports ESM
        }],
        '@babel/preset-react',
        '@babel/preset-typescript',
    ],
    // Include any plugins here if necessary
};