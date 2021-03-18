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
// function to check if user exists
const doesKeyExistInUsers = (key, variable) => {
  for (let user in users) {
    if (users[user][key] === variable) {
      return true;
    }
  }
  return false;
}; 

const doesEmailExistInUser = (email) =>{
  for (let id in users){
    if(users[id].email === email){
      return id; 
    }
  }
  return false;
};

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//login/out with res.cookie responses

app.get("/login", (req, res) => {
  const templateVars = { urls: urlDatabase, username: users[req.cookies["user_id"]]}
  res.render("urls_login", templateVars);
});
app.post("/login", (req, res) => {
  res.cookie("user_id", doesEmailExistInUser(req.body.email))
  res.redirect('/urls');
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id")
  res.redirect('/urls');
});

//ejs route handler for urls
app.get("/urls", (req, res) => {
const templateVars = { urls: urlDatabase, username: users[req.cookies["user_id"]]}
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
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], username: req.cookies["user_id"]};
  res.redirect(templateVars.longURL);
});

//get new route to submit a new URL
app.get("/urls/new", (req, res) => {
  const templateVars = {
    username: req.cookies["user_id"],
  };
  res.render("urls_new",templateVars);
});

//get handler for editing the long URL
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], username: req.cookies["user_id"]};
  
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

//get for registration
app.get('/register', (req, res) => {
  const templateVars = {
  username: req.cookies["username"],
  }
  //if already logged in, redirect to /urls
  if (req.cookies["username"]) {
    res.redirect('/urls');
    return;
  }
  res.render('registration', templateVars)
})
//POST for 
app.post('/register', (req, res) => {
   if (doesKeyExistInUsers('email', req.body.email)) {
    res.status(400)
    console.log(res.status(400))
    console.log(res.send(`status code: ${res.statusCode} email already in use`))
    res.send(`status code: ${res.statusCode} email already in use`);
    return;
  }
  if (req.body.email.length < 1 || req.body.password.length < 1) {
    res.status(400)
    res.send(`status code: ${res.statusCode} You must register with a valid Email and password`);
    return;
  }

  const userID = generateRandomString(6);
  // res.cookie(req.cookies["username"])
  users[userID] = {
    id: userID,
    email: req.body.email,
    password: req.body.password
  }
  //  users[userID] =userObj;
   res.cookie("user_id",userID);
   console.log(users)
   return res.redirect("/urls")
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
