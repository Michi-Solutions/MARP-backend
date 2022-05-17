const express = require('express');
const { areaConhecimento } = require('../../app/models');
const { Conteudo } = require('../../app/models');
const { User } = require('../../app/models');
const { Regra } = require('../../app/models');
const { Turma } = require('../../app/models');
const jwt = require('jsonwebtoken');

const conteudoRoutes = express.Router();

// list all areasConhecimento
conteudoRoutes.get('/conteudo', async (req, res) => {

    const token = req.headers.authorization.split(" ")[1];
    let decoded = jwt.verify(token, 'secret');
    const conteudos = []
    const _user = await User.findOne({ where: { id_usuario: decoded.id } });

    if(_user.perfil == 'student'){
        const _turma = await Turma.findAll({ where: { id_usuario: decoded.id } })
        
        for(let turma = 0; turma < _turma.length  ; turma++){
            console.log(_turma[turma].dataValues.id_area_conhecimento);
            const _conteudo = await Conteudo.findAll({ where: { id_area_conhecimento: _turma[turma].dataValues.id_area_conhecimento } })
            conteudos.push(_conteudo)
        }
    }else if(_user.perfil == 'professor'){
        const _areaConhecimento = await areaConhecimento.findAll({ where: { id_professor: decoded.id } })
        for(let turma = 0; turma < _areaConhecimento.length  ; turma++){
            const _conteudo = await Conteudo.findAll({ where: { id_area_conhecimento: _areaConhecimento[turma].dataValues.id_area_conhecimento } })
            conteudos.push(_conteudo)
        }

    }
    return res.json(conteudos);
})

conteudoRoutes.get('/conteudo/:id', async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        let decoded = jwt.verify(token, 'secret');

        const _conteudo = await Conteudo.findOne({ where: { id_conteudo: req.params.id } })
        const _turma = await Turma.findOne({ where: { id_usuario: decoded.id, id_area_conhecimento: _conteudo.dataValues.id_area_conhecimento  } })

        if (_turma != null) {
            return res.json(_conteudo);
        } else {
            return res.status(401).json({ msg: "You are not authorized to view this page" });
        }
    } catch {
        return res.status(401).json({ msg: "Invalid Credentials" });
    }
})

conteudoRoutes.post('/conteudo', async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        let decoded = jwt.verify(token, 'secret');
        const _user = await User.findOne({ where: { id_usuario: decoded.id } });

        if (_user.perfil === "professor") {
            const conteudo = { titulo, texto, tipo, id_area_conhecimento } = req.body

            const regra = { qtd_insercao, data_inicial, data_final } = req.body

            const _regra = await Regra.create({
                nome: regra.nome,
                qtd_insercao_dia: regra.qtd_insercao,
                data_inicial: Date.parse(regra.data_inicial),
                data_final: Date.parse(regra.data_final),
                ativa: true,
                data_cadastro: new Date(),
                data_exclusao: null
            })

            console.log(_regra.id_regra)

            const _conteudo = await Conteudo.create({
                titulo: conteudo.titulo,
                texto: conteudo.texto,
                tipo: conteudo.tipo,
                data_criacao: new Date(),
                data_exclusao: null,
                duracao: null,
                arquivo: req.files.arquivo,
                id_area_conhecimento: conteudo.id_area_conhecimento,
                id_regra: _regra.id_regra,
            });
            return res.status(201).json({ msg: "Created successfully" });
        } else {
            return res.status(401).json({ msg: "Token Invalid" });
        }
    } catch {
        return res.status(401).json({ msg: "Invalid Credentials" });
    }
    
})

module.exports = conteudoRoutes