module.exports = {
  mode: "development",
  devServer: {
    static: "./",
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
