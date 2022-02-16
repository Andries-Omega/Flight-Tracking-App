module.exports = {

    mode: "development",
    
    devServer: {
    
    static: "./src",
    
    },
    
    module: {
    
    rules: [
    
    {
    
    test: /\.(css)$/,
    
    use: ["style-loader", "css-loader"],
    
    },
    
    ],
    
    },
    
    };