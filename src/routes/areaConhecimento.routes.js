const express = require('express');
const { areaConhecimento } = require('../../app/models');
const { User } = require('../../app/models');
const jwt = require('jsonwebtoken');

const sendMail = require('../utils/sendMail');

const areaConhecimentoRoutes = express.Router();

areaConhecimentoRoutes.get('/areaConhecimento', async (req, res) => {
    const areasConhecimento = await areaConhecimento.findAll();
    return res.json(areasConhecimento);
})

//create
areaConhecimentoRoutes.post('/areaConhecimento', async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1]
        let decoded = jwt.verify(token, 'secret');
        const user = await User.findOne({ where: { id_usuario: decoded.id } });

        if(user.perfil === "professor"){
            const { nome, nome_curto, descricao, imagem } = req.body;
            await areaConhecimento.create({ 
                nome,
                nome_curto,
                descricao,
                imagem,
                ativo: true,
                data_criacao: new Date(),
                data_exclusao: null,
                id_professor: user.id_usuario
            });
            return res.status(201).json({ msg: "Area de Conhecimento created successfully" });
        }
    } catch {
        return res.status(401).json({ msg: "Invalid Credentials" });
    }
})
    

areaConhecimentoRoutes.get('/areaConhecimento/mylist', async (req, res) => {
    try{
        const token = req.headers.authorization.split(" ")[1]
        let decoded = jwt.verify(token, 'secret');
        const user = await User.findOne({ where: { id_usuario: decoded.id } });

        if(user.perfil === "professor"){
            const _areaConhecimento = await areaConhecimento.findAll({ where: { id_professor: decoded.id } });
            return res.json(_areaConhecimento);
        }
    } catch {
        return res.status(401).json({ msg: "Invalid Credentials" });
    }
})

areaConhecimentoRoutes.post('/areaConhecimento/generatetokens/:id', async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1]
        jwt.verify(token, 'secret');
        
        let tokenList = []

        for (const mail of Array(req.body.mails.length).keys()) {
            const token = (Math.random() + 1).toString(36).substring(3) + Math.random().toString(36).substring(2) + "(" +req.params.id + ")"; ;
            tokenList.push(token)

            sendMail(token, 
            req.body.mails[mail], 
            '/areaConhecimento/join', 
            "Você foi convidado para entrar em uma turma do MARP", 
            "Clique para entrar na turma", 
            "Convite para turma")
        }

        await areaConhecimento.update({tokens_entrada: {tokens: tokenList}},{ where: { id_area_conhecimento: req.params.id } });

        return res.status(201).json({ msg: "Tokens generated successfully" });

    } catch {
        return res.status(401).json({ msg: "Invalid Credentials" });
    }
})

areaConhecimentoRoutes.post('/areaConhecimento/join/:token', async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1]
        let decoded = jwt.verify(token, 'secret');

        const _areaConhecimento = await areaConhecimento.findOne({ where: { id_area_conhecimento: req.params.token.split("(")[1].split(")")[0] } })
        const user = await User.findOne({ where: { id_usuario: decoded.id } });

        if(_areaConhecimento.tokens_entrada["tokens"].includes(req.params.token)){

            await areaConhecimento.update({tokens_entrada: {tokens: _areaConhecimento.tokens_entrada["tokens"].filter(token => token !== req.params.token)}},{ where: { id_area_conhecimento: req.params.token.split("(")[1].split(")")[0] } });

            if (user.turmas_area_conhecimento.id_turmas[0] != null) {
                await User.update({turmas_area_conhecimento: {id_turmas : [...user.turmas_area_conhecimento.id_turmas, req.params.token.split("(")[1].split(")")[0] ]} },{ where: { id_usuario: decoded.id } });
            } else {
                await User.update({turmas_area_conhecimento: {id_turmas : [req.params.token.split("(")[1].split(")")[0] ]} },{ where: { id_usuario: decoded.id } });
            }

            return res.status(201).json({ msg: "Joined successfully" });
        }
        return res.status(200).json({ msg: "Token invalid" });
        
    } catch {
        return res.status(401).json({ msg: "Invalid Credentials" });
    }
})

module.exports = areaConhecimentoRoutes