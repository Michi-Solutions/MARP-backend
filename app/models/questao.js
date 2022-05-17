module.exports = (sequelize, DataTypes) => {
    const Questao = sequelize.define('Questao', {
        id_questao: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        enunciado: {
            type: DataTypes.STRING
        },
        tipo: {
            type: DataTypes.STRING
        },
        correta: {
            type: DataTypes.INTEGER
        },
        questao1: {
            type: DataTypes.STRING
        },
        questao2: {
            type: DataTypes.STRING
        },
        questao3: {
            type: DataTypes.STRING
        },
        questao4: {
            type: DataTypes.STRING
        },
        id_quiz: {
            type: DataTypes.INTEGER
        }
    }, {
        tableName: 'tbl_questao',
        timestamps: false
    })

    return Questao;
}