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
 const userLookUpWithEmail = (email) => {
   for(let user in users) {
    if(email === users[user].email){
     return users[user];
   }
  }; 
   return null;
 };
// const doesKeyExist= (key,variable) => {
//   for (let user in users) {
//     if (users[user][key] === variable) {
//       return true;
//     }
//   }
//   return false;
// }; 

// const email = (email) => {
//   console.log("tests", email)
//   for (let user in users) {
//     if (users[key].email === email) {
//       return database[user];
//     }
//   }
//   return undefined;
// };

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "test@example.com", 
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

app.post("/login", (req, res) => {
 const user = userLookUpWithEmail(req.body.email)
  if(!user){
  res.status(403).send('No email found')
  }
  if(req.body.password !== user["password"]){
    res.status(403).send('Incorrect Password')
  }
  res.cookie('user_id', req.body.email)
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
  const templateVars = { urls: urlDatabase, user : req.cookies.user_id }
  console.log(templateVars)
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  if (req.cookies.user_id) {
  let short = generateRandomString();
  urlDatabase[short] = { longURL: req.body.longURL, user : req.cookies.user_id }
  const templateVars = { shortURL: short, longURL: req.body.longURL, user : req.cookies.user_id };
  res.render("urls_show", templateVars);
  } else {
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
    user : req.cookies.user_id
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
  res.cookie('user_id', users[id].email)
  const templateVars = { cookies: req.cookies };
  res.redirect("/urls");
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
