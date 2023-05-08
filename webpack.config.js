module.exports = [
  {
    mode: "production",
    entry: {
      d2s: "./src/d2/index.ts",
    },
    plugins: [],
    output: {
      path: __dirname + "/dist",
      filename: "[name].bundle.min.js",
      library: "[name]",
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js"],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: "ts-loader",
          options: {
            configFile: "tsconfig.prod.json",
          },
        },
      ],
    },
  },
  {
    mode: "development",
    entry: {
      d2s: "./src/d2/index.ts",
    },
    devtool: "source-map", // For debugging
    plugins: [],
    output: {
      path: __dirname + "/dist",
      filename: "[name].bundle.js",
      library: "[name]",
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js"],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: "ts-loader",
          options: {
            configFile: "tsconfig.dev.json",
          },
        },
      ],
    },
  },
];
