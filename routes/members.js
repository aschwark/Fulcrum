const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {ensureAuthenticated} = require('../helpers/auth.js');

// Load member model
require('../models/Member');
const Member = mongoose.model('member');
const Post = mongoose.model('post');

// Member List Page
router.get('/memList', ensureAuthenticated, (req, res) => {
    // Search Function
    if (req.query.search){

        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Member.find({$or:[
            {name: regex},
            {position: regex},
            {organization: regex},
            {connection: regex},
            {languages: regex},
            {location: regex},
            {expertise: regex}
        ]})
            .sort({name:'asc'})
                .then(members => {
                    res.render('members/memList', {
                        members:members
                    });
                });
    } else {
        // Get all members and display
        Member.find({})
            .sort({name:'asc'})
                .then(allMembers => {
                    res.render('members/memList', {
                        members:allMembers
                    });
                });
        }
});

//Add Member Route
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('members/add');
});

//View Specific Member Route
router.get('/view/:id', ensureAuthenticated, (req, res) => {
    Member.findOne({
        _id: req.params.id
    })
    .then(member => {
        res.render('members/view', {
            member:member
        });
    });
});

//Edit Specific Member Route
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Member.findOne({
        _id: req.params.id
    })
    .then(member => {
        if(member.user != req.user.id){
            req.flash('error_msg', 'Not Authorized');
            res.redirect('/users/login')
        } else {
            res.render('members/edit', {
                member:member
            });
        }
    });
});

// Add Member Note Route
router.get('/addNote/:id', ensureAuthenticated, (req, res) => {
    Member.findOne({
        _id: req.params.id
    })
    .then(member => {
        res.render('members/addNote', {
            member:member
        });
    })
});

//Add Note Process
router.put('/addNote/:id', ensureAuthenticated, (req, res) => {
    let errors = [];
    
        if(!req.body.note){
            errors.push({text:'Please include a note'});
        }    
        if(errors.length > 0){
            res.render('members/addNote', {
                errors: errors
            })
        } else {
            Member.findByIdAndUpdate(
                {_id: req.params.id},
                { $push: { posts:{note: req.body.note}}},
                function(err, doc) {
                    if(err) {
                        console.log(err);
                    } else {
                        Member.findOne({
                            _id: req.params.id
                        })
                        .then(member => {
                            res.render('members/view', {
                                member:member
                            });
                            req.flash('success_msg', 'Note Added');
                        });
                    }
                }
            );
        }
});
        
// Delete Notes Route
router.delete('/note/:id/:id2', ensureAuthenticated, (req, res) => {
    let mem_id = req.params.id;
    let mem = req.params.id2;

    Member.findByIdAndUpdate(
        mem_id,
       { $pull: { 'posts': {  _id: mem } } } )
        .then(member => {
                Member.findOne({
                    _id: req.params.id
                })
                .then(member => {
                    res.render('members/view', {
                        member:member
                    });
                });
            })
});

// Process Form
router.post('/', ensureAuthenticated, (req, res) => {
let errors = [];

    if(!req.body.name){
        errors.push({text:'Please include a name'});
    }
    if(!req.body.expertise){
        errors.push({text:'Please include expertise notes'});
    }
    if(!req.body.connection){
        errors.push({text:'Please include who connected HM'});
    }

    if(errors.length > 0){
        res.render('members/add', {
            errors: errors,
            name: req.body.name,
            position: req.body.position,
            organization: req.body.organization,
            expertise: req.body.expertise,
            connection: req.body.connection,
            languages: req.body.languages,
            telephone: req.body.telephone,
            location: req.body.location,
            email: req.body.email
        })
    } else {
        const newUser = {
            name: req.body.name,
            position: req.body.position,
            organization: req.body.organization,
            expertise: req.body.expertise,
            connection: req.body.connection,
            languages: req.body.languages,
            telephone: req.body.telephone,
            whatsapp: req.body.whatsapp,
            location: req.body.location,
            email: req.body.email,
            commitment: req.body.commitment,
            user: req.user.id
        }
        new Member(newUser)
        .save()
        .then(member => {
            req.flash('success_msg', 'Hub Member Added');
            res.redirect('/members/memList');
        });
    };
});


// Edit Process Route
router.put('/:id', ensureAuthenticated, (req, res) => {
    Member.findOne({
        _id: req.params.id
    })
    .then(member => {
        member.name = req.body.name;
        member.position = req.body.position;
        member.organization = req.body.organization;
        member.expertise = req.body.expertise;
        member.connection = req.body.connection;
        member.languages = req.body.languages;
        member.telephone = req.body.telephone;
        member.whatsapp = req.body.whatsapp;
        member.location = req.body.location;
        member.email = req.body.email;
        member.commitment = req.body.commitment;

        member.save()
            .then(member => {
                req.flash('success_msg', 'HM Updated');
                Member.findOne({
                    _id: req.params.id
                })
                    res.render('members/view', {
                        member:member
                    });
            })
            .catch(err => {
                req.flash('error_msg', 'Ensure all REQUIRED areas are completed');
                res.redirect('/members/memList');
            })
    });
});

// Delete Hm
router.delete('/view/:id', ensureAuthenticated, (req, res) => {
    Member.remove({_id: req.params.id})
        .then(() => {
            req.flash('success_msg', 'HM Deleted');
            res.redirect('/members/memList');
        });
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;