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
 const userLookUpWithEmail = (email, database) => {
   for(let user in database) {
    if(email === database[user].email){
     return database[user];
   }
  }; 
   return null;
 };
 // function to check urls for each user

 const urlsForUser = function(id,database) {
  let output = {};
  for (let url in database) {
    if (database[url].userID === id) {
      console.log('hello')
      output[url] = database[url]
    }
  }
  return output;
};

module.exports = {generateRandomString, userLookUpWithEmail, urlsForUser}