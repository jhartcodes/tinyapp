const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
app.set("view engine", "ejs");
const bodyParser = require("body-parser");;
const cookieParser = require('cookie-parser')
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));


//global variables
const generateRandomString = (num) => {
  const char = "abcdefghijklmnopqrstuvwxyz0123456789";
  let random = '';
  for (let i = 0; i < num; i++) {
    random += char[Math.floor(Math.random() * char.length)];
  }
  return random;
};
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//login/out with res.cookie responses
app.post("/login", (req, res) => {
  res.cookie('username', req.body.username)
  res.redirect('/urls');
});
app.post("/logout", (req, res) => {
  res.clearCookie("username")
  res.redirect('/urls');
});

//ejs route handler for urls
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase, username: req.cookies["username"]};
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  const randomString = generateRandomString(6);
  let longURL = 'http://' + req.body.longURL;
  urlDatabase[randomString] = longURL;
  const templateVars = {
    shortURL: randomString,
    longURL: longURL
  };
  res.render('urls_show', templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], username: req.cookies["username"]};
  res.redirect(templateVars.longURL);
});

//set new route to submit a new URL
app.get("/urls/new", (req, res) => {
  const templateVars = {
    username: req.cookies["username"],
  };
  res.render("urls_new",templateVars);
});

//post handler for editing the long URL
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], username: req.cookies["username"]};
  
  res.render("urls_show", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//post handler for update long URL
app.post("/urls/:shortURL/update", (req, res)=>{
  const update = req.params.shortURL;
   urlDatabase[update] = req.body.updateURL;
  res.redirect("/urls/");
});

//post handler to delete URLS
app.post("/urls/:shortURL/delete", (req, res)=>{
  const id = req.params.shortURL;
  delete urlDatabase[id];
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
