const express = require('express');
const { User } = require('../../app/models');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const userRoutes = express.Router();

// register user
userRoutes.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;

    const salt = await bcrypt.genSalt(10);
    const encrypt_password = await bcrypt.hash(password, salt)
    await User.create({ 
        name: name,
        email: email,
        password: encrypt_password, 
        role: "user"
    });

    return res.status(201).json({msg: "User Created Successfully"});
})

// login user
userRoutes.post('/login', async (req, res) => {
    const { email, password } = req.body;
   
    const _user = await User.findOne({ where: {email : email}})
    if(_user.active === true) {
        if(_user){
            const isMatch = await bcrypt.compare(password, _user.password)
            if(isMatch){
                const token = jwt.sign({ id: _user.id }, 'secret', { expiresIn: '1h' });
                return res.json({ token, 
                    user: {id: _user.id, name: _user.name, email: _user.email, role: _user.role} });
            } else {
                return res.status(401).json({ msg: 'Invalid password' })
            }
        }
    } else {
        return res.status(401).json({ msg: 'User is not active' })
    }
    return res.status(401).json({ msg: "Invalid Credentials" });
})

//list all users
userRoutes.get('/userlist', async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        let decoded = jwt.verify(token, 'secret');
        const _user = await User.findOne({ where: { id: decoded.id } });

        if(_user.role.split(",").includes("admin")){
            const users = await User.findAll();
            return res.status(200).json(users);
        } else {
            return res.status(401).json({ msg: "You are not authorized to view this page" });
        }

    } catch {
        return res.status(401).json({msg: "Access Denied"});
    }
})

//list user
userRoutes.get('/user/:id', async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        let decoded = jwt.verify(token, 'secret');
        const _user = await User.findOne({ where: { id: decoded.id } });

        if(_user.role.split(",").includes("admin")){
            const user = await User.findOne({ where: { id: req.params.id } });
            return res.status(200).json(user);
        } else if (decoded.id == req.params.id) {
            const user = await User.findOne({ where: { id: req.params.id } });
            return res.status(200).json(user);
        } else {
            return res.status(401).json({ msg: "You are not authorized to view this page" });
        }

    } catch {
        return res.status(401).json({msg: "Access Denied"});
    }
})

//update user
userRoutes.put('/user/:id', async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1]
        let decoded = jwt.verify(token, 'secret');
        const { id } = req.params;
        const _user = await User.findOne({ where: { id: decoded.id } });

        if (_user.role.split(",").includes("admin")) {
            await User.update({ name: req.body.name }, { where: { id } });
            return res.json({ msg: "User Updated Successfully" });

        } else if(decoded.id == id){
            await User.update({ name: req.body.name }, { where: { id } });
            return res.json({ msg: "User Updated Successfully" });

        } else {
            return res.status(401).json({ msg: "You are not authorized to view this page" });
        }
    } catch {
        return res.status(401).json({ msg: "Access Denied" });
    }
})

//delete user
userRoutes.delete('/user/:id', async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1]
        let decoded = jwt.verify(token, 'secret');
        const { id } = req.params;
        const _user = await User.findOne({ where: { id: decoded.id } });

        if (_user.role.split(",").includes("admin")) {
            await User.update({ name: false }, { where: { id } });
            return res.json({ msg: "User Deleted Successfully" });

        } else if(decoded.id == id){
            await User.update({ active: false }, { where: { id } });
            return res.json({ msg: "User Deleted Successfully" });

        } else {
            return res.status(401).json({ msg: "You are not authorized to view this page" });
        }
    } catch {
        return res.status(401).json({ msg: "Access Denied" });
    }
})

module.exports = userRoutes;