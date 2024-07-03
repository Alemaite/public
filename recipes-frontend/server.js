const express = require("express");
const path = require("path");
const app = express();

app.use(
  express.static(path.join(__dirname, "./dist/recipes-frontend/browser"))
);

app.get("/*", (req, res) => {
  res.sendFile(
    path.join(__dirname, "dist/recipes-frontend/browser", "index.html")
  );
});

app.listen(process.env.PORT || 4201);
