//Function to create random ID# for both Users and URLDatabase
const generateRandomString = (num) => {
  const char = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let random = '';
  for (let i = 0; i < num; i++) {
    random += char[Math.floor(Math.random() * char.length)];
  }
  return random;
};

// Function to check if user exists with email
const userLookUpWithEmail = (email, database) => {
  for (const user in database) {
    if (email === database[user].email) {
      return database[user];
    }
  }
  return null;
};

// Function to show the URLs in 'output' for each user
const urlsForUser = function(id,database) {
  let output = {};
  for (const url in database) {
    if (database[url].userID === id) {
      output[url] = database[url];
    }
  }
  return output;
};

module.exports = {generateRandomString, userLookUpWithEmail, urlsForUser};