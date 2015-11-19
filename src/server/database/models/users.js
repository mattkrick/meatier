import thinky from './_utils';

const {type, r} = thinky;

const User = thinky.createModel("users", {
  id: type.string(),
  name: type.string(),
  email: type.string().email().required(),
  isVerified: type.boolean().default(false),
  password: type.string().required(),
  createdAt: type.date().default(r.now())
}, {
  enforce_extra: 'strict'
});
User.ensureIndex("email");
User.defineStatic("getView", function() {
  return this.without('password');
});


export function loginDB(email, password) {
  return new Promise(function (resolve, reject) {
    User.getAll(email, {index: 'email'}).limit(1).run()
      .then((users) => {
        const user = users[0];
        if (!user || user.password !== password) {
          reject(new Error('Incorrect email or password'));
        }
        delete user.password;
        delete user.createdAt;
        resolve(user);
      })
      .catch(() => {
        reject(new Error('Error logging on, please try again'));
      })
  })
}

export function loginWithIdDB(id) {
  //be careful, this issues a login without verifying the password (since token already did that)
  return new Promise(function (resolve, reject) {
    User.get(id).run()
      .then((user) => {
        delete user.password;
        delete user.createdAt;
        resolve(user);
      })
      .catch(() => {
        reject(new Error('Error logging on, please try again'));
      })
  })
}

export function signupDB(email, password, cb) {
  return new Promise(function (resolve, reject) {
    User.getAll(email, {index: 'email'}).run()
      .then((user) => {
        if (user || user.length > 0) {
          if (user.password === password) { //log the forgetful fool in
            resolve(user);
          } else {
            reject(new Error('Email already exists in database'));
          }
        }
        User.save({
            email,
            password
          })
          .then(user => resolve(user))
          .catch(() => {
            reject(new Error('Error signing up, please try again'));
          })
      })
    .catch(() => {
      //TODO: don't repeat catch clause
      reject(new Error('Error signing up, please try again'));
    })
  });
}

