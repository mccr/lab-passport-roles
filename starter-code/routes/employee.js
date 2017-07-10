var express = require('express');
var router = express.Router();
const User = require('../models/User');

// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin = require("connect-ensure-login");
const passport      = require("passport");

var path = require('path');
var debug = require('debug')('express-passport:'+path.basename(__filename));

router.get('/', function(req, res, next) {
  User.find({role: 'TA'}, (err, e) => {
    debug(e);
    if (err) {
        next();
        return err;
      } else {
        res.render('employee/index', {employees: e});
      }
  });
});

router.get('/new', function(req, res, next) {
  res.render('employee/new');
});

router.post('/new', function(req, res, next) {
  let {username, name, familyName, password} = req.body;

    if (username === "" || password === "") {
      res.render("employee/new", { message: "Indicate username and password" });
      return;
    }

    User.findOne({ username }, "username", (err, user) => {
      if (user !== null) {
        res.render("employee/new", { message: "The username already exists" });
        return;
      }

      const salt     = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newEmployee = User({
        username: username,
        password: hashPass,
        name: name,
        familyName: familyName,
        role: 'TA'
      });

      debug(newEmployee);

      newEmployee.save((err) => {
        if (err) {
          res.render("employee/new", { message: "Something went wrong" });
        } else {
          debug('new employee created');
          res.redirect("/employee");
        }
      });
    });
});

router.get('/:id/delete', function(req, res, next) {
  let id = req.params.id;
  User.findByIdAndRemove(id, (err, obj) => {
    if (err){ return next(err); }
    res.redirect("/employee");
  });
});

module.exports= router;
