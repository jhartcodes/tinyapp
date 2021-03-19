
//function to check if key and value exist and return true after variable is compared. 
const doesKeyExist= (key,variable) => {
  for (let user in users) {
    if (users[user][key] === variable) {
      return true;
    }
  }
  return false;
}; 
//function to check email in users
const email = (email) => {
  console.log("tests", email)
  for (let user in users) {
    if (users[key].email === email) {
      return database[user];
    }
  }
  return undefined;
};

const urlsForUser = function(id, database) {
  let output = {};
  for (let url in database) {
    if (id === database[url].userID) {
      output[url] = database[url];
    }
  }
  return output;
};

const generateRandomString = (num) => {
  const char = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let random = '';
  for (let i = 0; i < num; i++) {
    random += char[Math.floor(Math.random() * char.length)];
  }
  return random;
};