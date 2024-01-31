const passport = require("passport");

exports.isAuth = (req, res, next) => {
  return passport.authenticate("jwt", { session: false })(req, res, next);
};

exports.sanitizeUser = (user) => {
  return { id: user.id, role: user.role };
};

exports.cookieExtractor = function (req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["jwt"];
  }
  // //TODO : this is temporary token for testing without cookie
  // token =
 
  //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YjU3ZDNiYTc1YzZmODA0MWIwNzdiZSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjg5NjE1NzkxfQ.75dgR47bmiQ7hURebB44P064NPa3RpQyIlk0csRylrM";
  console.log("cookie",token)
  return token;
};
