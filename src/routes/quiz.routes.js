const express = require('express');
const { areaConhecimento } = require('../../app/models');
const { Conteudo } = require('../../app/models');
const { User } = require('../../app/models');
const { Regra } = require('../../app/models');
const { Quiz } = require('../../app/models');
const { Questao } = require('../../app/models');
const jwt = require('jsonwebtoken');

const quizRoutes = express.Router();

// list all areasConhecimento
quizRoutes.get('/quiz', async (req, res) => {
    const _quiz = await Quiz.findAll();
    const _questao = await Questao.findAll();
    return res.json({ _quiz, _questao });
})

quizRoutes.post('/quiz', async (req, res) => {
    const quiz = { titulo, id_conteudo } = req.body
    const questao = { questoes } = req.body
    const regra = { qtd_insercao, data_inicial, data_final } = req.body

    const _regra = await Regra.create({
        qtd_insercao_dia: regra.qtd_insercao,
        data_inicial: Date.parse(regra.data_inicial),
        data_final: Date.parse(regra.data_final),
        ativa: true,
        data_cadastro: new Date(),
        data_exclusao: null
    })

    const _quiz = await Quiz.create({
        titulo: quiz.titulo,
        id_conteudo: quiz.id_conteudo,
        id_regra: _regra.id_regra_conteudo
    });

    for (let __questao = 0; __questao < Object.keys(questao.questoes).length; __questao++) {
        console.log(questao.questoes[__questao], "....")
        const _questao = await Questao.create({
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
})
module.exports = quizRoutes