const express = require('express');
const { areaConhecimento } = require('../../app/models');
const { Conteudo } = require('../../app/models');
const { User } = require('../../app/models');
const { Regra } = require('../../app/models');
const { Quiz } = require('../../app/models');
const { Questao } = require('../../app/models');
const { Turma } = require('../../app/models');
const jwt = require('jsonwebtoken');

const quizRoutes = express.Router();

// list all areasConhecimento
quizRoutes.get('/quiz/:id', async (req, res) => {

    const token = req.headers.authorization.split(" ")[1];
    let decoded = jwt.verify(token, 'secret');


    const _quiz = await Quiz.findOne({ where: { id_quiz: req.params.id } });
    const _conteudo = await Conteudo.findOne({ where: { id_conteudo: _quiz.dataValues.id_conteudo } })
    const _turma = await Turma.findOne({ where: { id_usuario: decoded.id, id_area_conhecimento: _conteudo.dataValues.id_area_conhecimento  } })
    const _questao = await Questao.findAll({ where: { id_quiz: req.params.id } });

    if (_turma != null) {
        return res.json({quiz: _quiz, questoes: _questao});
    }
    
})

quizRoutes.post('/quiz', async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        let decoded = jwt.verify(token, 'secret');
        const _user = await User.findOne({ where: { id_usuario: decoded.id } });
        if (_user.perfil === "professor") {
            const quiz = { titulo, id_conteudo } = req.body
            const questao = { questoes } = req.body
            const regra = { qtd_insercao, data_inicial, data_final } = req.body

            const _regra = await Regra.create({
                qtd_insercao_dia: regra.qtd_insercao_dia,
                data_inicial: Date.parse(regra.data_inicial),
                data_final: Date.parse(regra.data_final),
                ativa: true,
                data_cadastro: new Date(),
                data_exclusao: null
            })

            const _quiz = await Quiz.create({
                titulo: quiz.titulo,
                id_conteudo: quiz.id_conteudo,
                id_regra: _regra.id_regra
            });

            for (let __questao = 0; __questao < Object.keys(questao.questoes).length; __questao++) {
                await Questao.create({
                    titulo: questao.questoes[__questao].titulo,
                    enunciado: questao.questoes[__questao].enunciado,
                    tipo: questao.questoes[__questao].tipo,
                    correta: questao.questoes[__questao].correta,
                    questao1: questao.questoes[__questao].questao1,
                    questao2: questao.questoes[__questao].questao2,
                    questao3: questao.questoes[__questao].questao3,
                    questao4: questao.questoes[__questao].questao4,
                    id_quiz: _quiz.id_quiz
                });
            }
            
            return res.status(201).json({ msg: "Quiz created successfully" });
        } else {
            return res.status(401).json({ msg: "Token Invalid" });
        }
    } catch {
        return res.status(401).json({ msg: "Invalid Credentials" });
    }
})
module.exports = quizRoutes