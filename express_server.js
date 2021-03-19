const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
app.set("view engine", "ejs");
const bodyParser = require("body-parser");;
const cookieParser = require('cookie-parser')
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));


//global variables
//randomString variable. 
const generateRandomString = (num) => {
  const char = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let random = '';
  for (let i = 0; i < num; i++) {
    random += char[Math.floor(Math.random() * char.length)];
  }
  return random;
};
// function to check if user exists
 const userLookUpWithEmail = (email) => {
   for(let user in users) {
    if(email === users[user].email){
     return users[user];
   }
  }; 
   return null;
 };
 // function to check urls for each user

 const urlsForUser = function(id) {
  let output = {};
  for (let url in urlDatabase) {
    if (urlDatabase[url].userID === id) {
      output[url] = urlDatabase[url]
    }
  }
  return output;
};

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

//login/out with res.cookie responses

app.post("/login", (req, res) => {
 const user = userLookUpWithEmail(req.body.email)
  if(!user){
  return res.status(403).send('No email found');
  }
  if(req.body.password !== user["password"]){
    return res.status(403).send('Incorrect Password');
  }
  res.cookie('user_id', user.id)
  res.redirect('/urls')
});

app.get("/login", (req, res) => {
  const templateVars = { urls: urlDatabase, user : req.cookies.user_id };
  res.render("urls_login", templateVars);
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id")
  res.redirect('/urls');
});

//ejs route handler for urls

app.get("/urls", (req, res) => {
  const currentUserId = req.cookies['user_id'];
  const filter = urlsForUser(currentUserId)
  const templateVars ={urls: filter, user: users[currentUserId]}
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  const currentUserId = req.cookies["user_id"];
  if (req.cookies.user_id) {
  let short = generateRandomString(6);
  urlDatabase[short] = { longURL: req.body.longURL, userID : req.cookies.user_id }
  const filter = urlsForUser(currentUserId)
  const templateVars ={urls: filter, user: users[currentUserId]}
  res.render('urls_index', templateVars);
  } else {
    res.status(400).send('Must be logged in to make new URL')
    res.redirect('/login')
  }
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL
  res.redirect(longURL);
});

//get new route to submit a new URL
app.get("/urls/new", (req, res) => {
  const templateVars = {
    user : users[req.cookies["user_id"]]
  };
  res.render("urls_new",templateVars);
});

//get handler for editing the long URL
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], user: req.cookies["user_id"],cookies: req.cookies};
  
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
app.get("/register", (req, res) => {
  const templateVars = {
  user : req.cookies.user_id
  };

  res.render('registration', templateVars)
})
//POST for registeration page
app.post("/register", (req, res) => {
  const user = userLookUpWithEmail(req.body.email)
  console.log(user)
  if (req.body.email === '' || req.body.password === '') {
  return res.status(400).send('Please enter a valid email and password.');
  }
  if (user) {
  return res.status(400).send('This email already exists.');
  };
 
  const id = generateRandomString(6);
  users[id] = { id: id, email: req.body.email, password: req.body.password}
  res.cookie('user_id', id)
  res.redirect("/urls");
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
