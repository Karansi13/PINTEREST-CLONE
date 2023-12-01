var express = require("express");
var router = express.Router();
const userModel = require("./users");
const postModel = require("./posts");
const passport = require("passport");

// in dono line se user login hota hai
const localStrategy = require("passport-local");
// passport.authenticate(new localStrategy(userModel.authenticate())) mistake..
passport.use(new localStrategy(userModel.authenticate()))

router.get("/", function (req, res, next) {
  res.render("index", { title: "Pinterest" });
});

router.get("/login", function (req, res, next) {
  res.render("login", { title: "login" });
});

router.get("/feed", function (req, res, next) {
  res.render("feed");
});

router.get('/profile', isLogedIn, function(req, res, next) {
  res.render("profile")
})

router.post("/register", function (req, res) {
  // const userData = new userModel({
  //   username: req.body.username,
  //   email: req.body.email,
  //   fullName: req.body.fullName,
  // })
  const { username, email, fullName } = req.body;
  const userData = new userModel({ username, email, fullName });

  userModel.register(userData, req.body.password).then(function(){
    passport.authenticate("local")(req,res,function(){
      res.redirect("/profile")
    })
  })
});

router.post("/login", passport.authenticate("local",{
  successRedirect: "/profile",
  failureRedirect: "/login"
}), function(req, res) {
});

router.get("/logout", function(req,res) {
  //From Dox of Passport
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
})

function isLogedIn(req, res, next) {
  if(req.isAuthenticated()) return next();
  res.redirect("/login")
}
module.exports = router;











// DATA ASSOCIATION
// router.get('/alluserposts', async function(req, res, next) {
//   let user = await userModel.findOne({_id: "65633d37420b3c0b2cf3ac84"}).populate('posts')

//   res.send(user);
// });

// router.get('/createuser', async function (req, res, next) {
//   let createdUser = await userModel.create({
//     username: "karann",
//     password: "karan",
//     posts: [],
//     email: "kar@123.com",
//     fullName: "karan singh kalsi",
//   });
//   res.send(createdUser)
// })

// router.get('/createpost', async function (req, res, next) {
//   let createdPost = await postModel.create({
//     postText: "Hello bhai",
//     user: "65633d37420b3c0b2cf3ac84",
//   })
//   let user = await userModel.findOne({_id: "65633d37420b3c0b2cf3ac84"})
//   user.posts.push(createdPost._id)
//   await user.save();
//   res.send("done")
// })
