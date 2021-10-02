module.exports = {
    "presets": [["@babel/preset-env", {
        "targets": {
            "node": "current"
        }
    }],
        "@babel/preset-typescript"],
    "plugins": ["babel-plugin-add-module-exports"],
    "env": {
        "rollup": {
            "plugins": [
                "babel-plugin-add-module-exports",
                ["@babel/plugin-transform-runtime", {
                    "regenerator": true
                }],
            ]
        },
        "test": {
            "plugins": ["@babel/plugin-transform-runtime"]
        }
    }
};
