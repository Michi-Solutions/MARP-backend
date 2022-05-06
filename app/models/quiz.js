module.exports = (sequelize, DataTypes) => {
    const Quiz = sequelize.define('Quiz', {
        id_quiz: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        titulo: {
            type: DataTypes.STRING
        },
        id_conteudo: {
            type: DataTypes.INTEGER
        },
        id_regra: {
            type: DataTypes.INTEGER
        }
    }, {
        tableName: 'tbl_quiz',
        timestamps: false
    })

    return Quiz;
}