var Post = require('../models/models');
var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var express = require('express');
var router = express.Router();

router.use('/posts', function(req, res, next){
    
    if(req.method === 'GET'){
        return next();
    }
    
    if(!req.isAuthenticated()){
        return res.redirect('/#login');
    }
    
    return next();
});

//api for all posts
router.route('/posts')
    //create a new posts
    .post(function(req, res){
        
        var newPost = new Post();
        newPost.text = req.body.text;
        newPost.created_by = req.body.created_by;
    
        newPost.save(function(err,post){
            if(err){
                 return res.send(500, err);
            }
             return res.json(newPost);
        });
        //res.send({message:"craete new post"});
    })

    .get(function(req, res){
        
        Post.find(function(err, posts){
            if(err){
                return res.send(500, err);
            }
            
            return res.send(posts);
        });
        //res.send({message:"get all posts"});    
    });

//api for single post
router.route('/posts/:id')
    //create
    .put(function(req,res){
        Post.findById(req.params.id, function(err, post){
            if(err){
                res.send(500, err);
            }
            
            post.created_by = req.body.created_by;
            post.text = req.body.text;
            
            post.save(function(err, post){
                if(err){
                    res.send(500, err);
                }
                
                res.json(post);
            });            
            
        });
        //return res.send({message:'TODO modify an existing post by using param ' + req.params.id});
    })
    .get(function(req,res){
        Post.findById(req.params.id, function(err, post){
            if(err){
                res.send(500, err);
            }
            res.json(post);
        });
        //return res.send({message:'TODO get an existing post by using param ' + req.params.id});
    })

    .delete(function(req,res){
        Post.remove({_id: req.params.id}, function(err){
            if(err){
                res.send(500, err);
            }
            res.json("deleted !!");
        });
        //return res.send({message:'TODO delete an existing post by using param ' + req.params.id})
    });

module.exports = router;