const express = require('express');
const { areaConhecimento } = require('../../app/models');
const { Conteudo } = require('../../app/models');
const { User } = require('../../app/models');
const { Regra } = require('../../app/models');
const jwt = require('jsonwebtoken');

const conteudoRoutes = express.Router();

// list all areasConhecimento
conteudoRoutes.get('/conteudo', async (req, res) => {
    //TODO: implementar filtros para acesso do conteudo

    const token = req.headers.authorization.split(" ")[1];
    let decoded = jwt.verify(token, 'secret');
    const _user = await User.findOne({ where: { id_usuario: decoded.id } });
    

    for(let id_turma = 0; id_turma < _user.dataValues.turmas_area_conhecimento.id_turmas.length  ; id_turma++){
        const _areaConhecimento = await areaConhecimento.findOne({ where: { id_area_conhecimento: _user.dataValues.turmas_area_conhecimento.id_turmas[id_turma] } });
        
        const _conteudo = await Conteudo.findAll({ where: { id_area_conhecimento: _areaConhecimento.dataValues.id_area_conhecimento } });
        console.log(_conteudo);
        return res.json(_conteudo);
    }

    const _conteudos = await Conteudo.findAll();
    return res.json(_conteudos);
})

conteudoRoutes.post('/conteudo', async (req, res) => {
    const bodyConteudo = { titulo, texto, tipo, id_area_conhecimento } = req.body

    const bodyRegra = { qtd_insercao, data_inicial, data_final } = req.body

    console.log(req.files.arquivo)

    const _regra = await Regra.create({
        nome: bodyRegra.nome,
        qtd_insercao_dia: bodyRegra.qtd_insercao,
        data_inicial: Date.parse(bodyRegra.data_inicial),
        data_final: Date.parse(bodyRegra.data_final),
        ativa: true,
        data_cadastro: new Date(),
        data_exclusao: null
    })

    const _conteudo = await Conteudo.create({
        titulo: bodyConteudo.titulo,
        texto: bodyConteudo.texto,
        tipo: bodyConteudo.tipo,
        data_criacao: new Date(),
        data_exclusao: null,
        duracao: null,
        arquivo: req.files.arquivo,
        id_area_conhecimento: bodyConteudo.id_area_conhecimento,
        id_regra: _regra.id_regra_conteudo,
    });

    return res.status(201).json({ msg: "Conteudo created successfully" });
})

module.exports = conteudoRoutes