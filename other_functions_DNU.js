
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