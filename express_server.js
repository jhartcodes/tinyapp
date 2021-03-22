const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bcrypt = require('bcryptjs');
app.set("view engine", "ejs");
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({ name: 'session', keys: ['keyOne','keyTwo'],}));
const {generateRandomString, userLookUpWithEmail, urlsForUser} = require('./helpers');

//Database
const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "test@example.com",
    password: "ez123"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "user2RandomID" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "userRandomID" }
};

//login/out
app.post("/login", (req, res) => {
 
  const user = userLookUpWithEmail(req.body.email, users);
  if (!user) {
    return res.status(403).send('No email found');
  }
  if (!bcrypt.compareSync(req.body.password, user.password)) {
    return res.status(403).send('Incorrect Password');
  }
  req.session.user_id = user.id;
  res.redirect('/urls');
});

app.get("/login", (req, res) => {
  const currentUserId = req.session.user_id;
  if (currentUserId) {
    res.redirect('/urls');
  } else {
    const templateVars = { urls: urlDatabase, user: users[req.session.user_id] };
    res.render("urls_login", templateVars);
  }
  
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect('/urls');
});

//Get to read a URLs page
app.get("/urls", (req, res) => {
  const currentUserId = req.session.user_id;
  if (currentUserId) {
    const filter = urlsForUser(currentUserId, urlDatabase);
    const templateVars = {urls: filter, user: users[currentUserId]};
    res.render("urls_index", templateVars);
  } else {
    res.redirect('/login');
  }
});

//Post to create a new URL
app.post("/urls", (req, res) => {
  const currentUserId = req.session.user_id;
  if (req.session.user_id) {
    let short = generateRandomString(6);
    urlDatabase[short] = { longURL: req.body.longURL, userID : req.session.user_id };
    const filter = urlsForUser(currentUserId, urlDatabase);
    const templateVars = {urls: filter, user: users[currentUserId]};
    res.render('urls_index', templateVars);
  } else {
    res.status(400).send('Must be logged in to make new URL');
    res.redirect('/login');
  }
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

app.get("/urls/new", (req, res) => {
  const templateVars = {user : users[req.session["user_id"]]};
  res.render("urls_new",templateVars);
});

// Get handler for new URLs page.
app.get("/urls/:shortURL", (req, res) => {
  if (req.session.user_id === urlDatabase[req.params.shortURL].userID) {
    const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL, user: users[req.session["user_id"]], cookies: req.session};
    return res.render("urls_show", templateVars);
  } else {
    res.status(400).send('Must be logged in to make new URL');
    return res.redirect('/login');
  }
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// Post to create short Urls for user
app.post("/urls/:shortURL", (req, res)=>{
  const update = req.params.shortURL;
  urlDatabase[update].longURL = req.body.updateURL;
  res.redirect("/urls/");
});

// Post to delete urls for user
app.post("/urls/:shortURL/delete", (req, res)=>{
  const url = req.params.shortURL;
  const userId = req.session["user_id"];
  if (userId && urlDatabase[url].userID === userId) {
    delete urlDatabase[url];
    res.redirect('/urls');
  } else {
    res.redirect('/urls');
  }
});

//Get for Registration page.
app.get("/register", (req, res) => {
  const templateVars = {
    user : users[req.session.user_id]
  };
  res.render('registration', templateVars);
});

//POST for registeration page
app.post("/register", (req, res) => {
  const user = userLookUpWithEmail(req.body.email, users);
  if (req.body.email === '' || req.body.password === '') {
    return res.status(400).send('Please enter a valid email and password.');
  }
  if (user) {
    return res.status(400).send('This email already exists.');
  }
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);
  
  const id = generateRandomString(6);
  users[id] = { id: id, email: req.body.email, password: hashedPassword};
  req.session.user_id = users[id].id;
  res.redirect("/urls");
});

// Read to redirect all incorrect URLs to URL page.
app.get("/", (req, res) => {
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
