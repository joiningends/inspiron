const {User} = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


router.get(`/`, async (req, res) =>{
    const userList = await User.find().select('-passwordHash');
    if(!userList) {
        res.status(500).json({success: false})
    } 
    res.send(userList);
})

router.get('/:id', async(req,res)=>{
    const user = await User.findById(req.params.id).select('-passwordHash');

    if(!user) {
        res.status(500).json({message: 'The user with the given ID was not found.'})
    } 
    res.status(200).send(user);
})

// Create a new user
router.post('/', async (req, res) => {
  let user = new User({
    firstname: req.body.firstname,
      middlename: req.body.middlename,
      lastname: req.body.lastname,
      mobile: req.body.mobile,
      email: req.body.email,
      passwordHash: bcrypt.hashSync(req.body.password, 10),
      host: req.body.host,
      intro: req.body.intro ,
      profile: req.body.profile,
      
    
})
user = await user.save();

    if(!user)
    return res.status(400).send('the user cannot be created!')

    res.send(user);
})
router.put('/:id',async (req, res)=> {

    const userExist = await User.findById(req.params.id);
    let newPassword
    if(req.body.password) {
        newPassword = bcrypt.hashSync(req.body.password, 10)
    } else {
        newPassword = userExist.passwordHash;
    }

    const user = await User.findByIdAndUpdate(
        req.params.id,
        {
        firstname: req.body.firstname,
      middlename: req.body.middlename,
      lastname: req.body.lastname,
      mobile: req.body.mobile,
      email: req.body.email,
      passwordHash: bcrypt.hashSync(req.body.password, 10),
      host: req.body.host,
      intro: req.body.intro ,
      profile: req.body.profile,
   
        },
        { new: true}
    )

    if(!user)
    return res.status(400).send('the user cannot be created!')

    res.send(user);
})
router.post('/login', async (req,res) => {
    const user = await User.findOne({email: req.body.email})
    const secret = process.env.secret;
    if(!user) {
        return res.status(400).send('The user not found');
    }

    if(user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
        const token = jwt.sign(
            {
                userId: user.id,
                
            },
            secret,
            {expiresIn : '1d'}
        )
       
        res.status(200).send({user: user.email , token: token}) 
    } else {
       res.status(400).send('password is wrong!');
    }

    
})


router.post('/register', async (req,res)=>{
    let user = new User({
        firstname: req.body.firstname,
      middlename: req.body.middlename,
      lastname: req.body.lastname,
      mobile: req.body.mobile,
      email: req.body.email,
      passwordHash: bcrypt.hashSync(req.body.password, 10),
      host: req.body.host,
      intro: req.body.intro ,
      profile: req.body.profile,
    })
    user = await user.save();

    if(!user)
    return res.status(400).send('the user cannot be created!')

    res.send(user);
})


router.delete('/:id', (req, res)=>{
    User.findByIdAndRemove(req.params.id).then(user =>{
        if(user) {
            return res.status(200).json({success: true, message: 'the user is deleted!'})
        } else {
            return res.status(404).json({success: false , message: "user not found!"})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err}) 
    })
})

router.get(`/get/count`, async (req, res) =>{
    const userCount = await User.countDocuments((count) => count)

    if(!userCount) {
        res.status(500).json({success: false})
    } 
    res.send({
        userCount: userCount
    });
})





module.exports = router;
