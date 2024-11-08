const express = require("express");
const mongoose = require("mongoose");
const app = express();
const ShortUrl = require("./models/shortUrl");

mongoose
  .connect("mongodb://localhost/urlShortener")
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Could not connect to MongoDB:", error));

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.static("assets"));

app.get("/", async (req, res) => {
  const shortUrls = await ShortUrl.find();
  res.render("index", { shortUrls: shortUrls });
});

app.post("/shortUrls", async (req, res) => {
  await ShortUrl.create({ full: req.body.fullUrl });
  res.redirect("/");
});

app.get("/:shortUrl", async (req, res) => {
  const shortUrl = await ShortUrl.findOne({
    short: req.params.shortUrl,
  });
  if (shortUrl == null) return res.sendStatus(404);

  shortUrl.save();

  res.redirect(shortUrl.full);
});
app.listen(process.env.PORT || 5000);
