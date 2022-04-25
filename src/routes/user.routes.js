const express = require('express');
const { User } = require('../../app/models');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const sendMail = require('../utils/sendMail');

const userRoutes = express.Router();

// register user
userRoutes.post('/register', async (req, res) => {
    const { nome, sobrenome, mail, senha, professor } = req.body;

    const salt = await bcrypt.genSalt(10);
    const encrypt_password = await bcrypt.hash(senha, salt)

    if (professor) {
        await User.create({
            nome: nome,
            sobrenome: sobrenome,
            mail: mail,
            senha: encrypt_password,
            inativo: false,
            data_cadastro: new Date(),
            data_exclusao: null,
            perfil: 'professor',
          });
    } else {
        await User.create({
            nome: nome,
            sobrenome: sobrenome,
            mail: mail,
            senha: encrypt_password,
            inativo: false,
            data_cadastro: new Date(),
            data_exclusao: null,
            perfil: 'student',
          });
    }
    

    return res.status(201).json({msg: "User Created Successfully"});
})

// login user
userRoutes.post('/login', async (req, res) => {
    try{
        const { mail, senha } = req.body;
   
        const _user = await User.findOne({ where: {mail : mail}})
        if(_user.inativo === false) {
            if(_user){
                const isMatch = await bcrypt.compare(senha, _user.senha)
                if(isMatch){
                    const token = jwt.sign({ id: _user.id_usuario }, 'secret', { expiresIn: '1h' });
                    return res.json({ token, 
                        usuario: {id: _user.id_usuario, nome: _user.nome, sobrenome: _user.sobrenome, mail: _user.mail, perfil: _user.perfil} });
                } else {
                    return res.status(401).json({ msg: 'Invalid password' })
                }
            }
        } else {
            return res.status(401).json({ msg: 'User is not active' })
        }

    } catch {
        return res.status(401).json({ msg: "Invalid Credentials" });
    }
    
})

//list all users
userRoutes.get('/user/list', async (req, res) => {
    const users = await User.findAll();
    return res.status(200).json(users);
    // try {
    //     const token = req.headers.authorization.split(" ")[1];
    //     let decoded = jwt.verify(token, 'secret');
    //     const _user = await User.findOne({ where: { id: decoded.id } });

    //     if(_user.role.split(",").includes("admin")){
    //         const users = await User.findAll();
    //         return res.status(200).json(users);
    //     } else {
    //         return res.status(401).json({ msg: "You are not authorized to view this page" });
    //     }

    // } catch {
    //     return res.status(401).json({msg: "Access Denied"});
    // }
})

//list user
userRoutes.get('/user/:id', async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        let decoded = jwt.verify(token, 'secret');
        const _user = await User.findOne({ where: { id_usuario: decoded.id } });

        if(_user.perfil === "admin"){
            const _user = await User.findOne({ where: { id_usuario: req.params.id } });
            return res.status(200).json({ usuario: {id: _user.id_usuario, nome: _user.nome, sobrenome: _user.sobrenome, mail: _user.mail, perfil: _user.perfil} });

        } else if (decoded.id == req.params.id) {
            return res.status(200).json({ usuario: {id: _user.id_usuario, nome: _user.nome, sobrenome: _user.sobrenome, mail: _user.mail, perfil: _user.perfil} });
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
        const { nome, sobrenome } = req.body;
        const token = req.headers.authorization.split(" ")[1]
        let decoded = jwt.verify(token, 'secret');

        const _user = await User.findOne({ where: { id_usuario: decoded.id } });

        if (_user.perfil === "admin") {
            await User.update({ nome: nome, sobrenome: sobrenome  }, { where: { id_usuario: req.params.id } });
            return res.status(200).json({ msg: "User Updated Successfully" });

        } else if(decoded.id == req.params.id){
            await User.update({ nome: nome, sobrenome: sobrenome  }, { where: { id_usuario: decoded.id } });
            return res.status(200).json({ msg: "User Updated Successfully" });

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

        const _user = await User.findOne({ where: { id_usuario: decoded.id } });

        if (_user.perfil === "admin") {
            await User.update({ inativo: true, data_exclusao: new Date()  }, { where: { id_usuario: req.params.id } });
            return res.status(200).json({ msg: "User Deleted Successfully" });

        } else if(decoded.id == req.params.id){
            await User.update({ inativo: true, data_exclusao: new Date()  }, { where: { id_usuario: decoded.id } });
            return res.status(200).json({ msg: "User Deleted Successfully" });

        } else {
            return res.status(401).json({ msg: "You are not authorized to view this page" });
        }

    } catch {
        return res.status(401).json({ msg: "Access Denied" });
    }
})

// reset password and generete token
userRoutes.post('/user/resetpassword', async (req, res) => {
    try {
        const token = (Math.random() + 1).toString(36).substring(7)
        await User.update({ resetPasswordToken: token }, { where: { email: req.body.email } });
        sendMail(token, req.body.email);
        return res.json({ msg: "Email Send" });

    } catch {
        return res.status(401).json({ msg: "Invalid email" });
    }
})

// change password with token
userRoutes.put('/user/resetpassword/:resetPasswordToken', async (req, res) => {
    try {
        const _user = await User.findOne({ where: { resetPasswordToken: req.params.resetPasswordToken } });
        if(_user){
            const salt = await bcrypt.genSalt(10);
            const encrypt_password = await bcrypt.hash(req.body.password, salt)
            await User.update({ password: encrypt_password, resetPasswordToken: null }, { where: { resetPasswordToken: req.params.resetPasswordToken } });
            return res.json({ msg: "Password Changed Successfully" });
        } else {
            return res.status(401).json({ msg: "Invalid token" });
        }

    } catch {
        return res.status(401).json({ msg: "Invalid token" });
    }
})


userRoutes.post('/user/professor', async (req, res) => {

})

module.exports = userRoutes;