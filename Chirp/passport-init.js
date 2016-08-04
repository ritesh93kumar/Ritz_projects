var User = require('./models/models');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var LocalStrategy = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');
//temp data source
//var users = {};

module.exports = function(passport){
    
    // Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function(user, done){
        console.log('serializing user:', user.username);
        //return unique ID for the user
        done(null, user._id);
    });
    
    //Desieralize user will call with the unique id provided by serializeuser
    passport.deserializeUser(function(id, done){
        
        User.findById(id, function(err, user){
            console.log('Deserializing user: ' + user.username)
             done(err, user);
        });
        
        //return done(null, users[username]);
    });
    
    passport.use('login', new LocalStrategy({
            passReqToCallback : true
        },
        function(req, username, password, done){
        
            User.findOne({'username': username}, function(err, user){
                if(err){
                    return done(err);
                }
                if(!user){
                    console.log('user not found with username: ' + username);
                    return done('user dont exists',false);
                }
                if(!isValidPassword(user,password)){
                    console.log('Wrong password');
                    return done('Wrong password',false);
                }            
                return done(null, user);
            });
            /*if(!users[username]){
                console.log('user not found ' + username);
                return done('user not found', false);
            }
        
            if(isValidPassword(users[username], password)){
                console.log("welcome" + users[username].username + "ur passs is " + password);
                return done(null, users[username]);
            }
            else{
                console.log('Invalid password' + username);
                return done(null, false);
            }*/
        }        
    ));
    
    passport.use('signup', new LocalStrategy({
            passReqToCallback : true
        }, 
        function(req, username, password, done){
            User.findOne({'username': username}, function(err, user){
                if(err){
                    return done('Error in signup', err);
                }
                
                if(user){
                    console.log('user already exists');
                    return done('username taken !', false);
                }
                else{
                    var newUser = new User();
                    
                    newUser.username = username;
                    newUser.password = createHash(password);
                    
                    newUser.save(function(err){
                        if(err){
                            console.log('error in saving user' + err);
                            throw err;
                        }
                        
                        console.log(newUser.username + ' registration successful ');
                        return done(null, newUser);
                    });
                }
            });
            
            /*if(users[username]){
                console.log('User already exists with username: ' + username);
                return done('User already exists with username', false);
            }
        
            //store in memory
            users[username] = {
                username: username,
                password: createHash(password)
            };
            
            console.log(users[username].username + ' Registration successful');
            return done(null, users[username]);*/
        }        
    ));
    
    var isValidPassword = function(user, password){
        return bCrypt.compareSync(password, user.password);
    };
    var createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    };
};