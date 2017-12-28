var path = require("path");
module.exports = {
  entry: {
    app: ["./js/text/text_to_shape.js"]
  },
  output: {
    path: path.resolve(__dirname, "build"),
    publicPath: "/builds/",
    filename: "bundle.js"
  }
};
