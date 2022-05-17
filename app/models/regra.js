module.exports = (sequelize, DataTypes) => {
    const Regra = sequelize.define('Regra', {
        id_regra: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        qtd_insercao_dia: {
            type: DataTypes.INTEGER
        },
        data_inicial: {
            type: DataTypes.DATE
        },
        data_final: {
            type: DataTypes.DATE
        },
        ativa: {
            type: DataTypes.BOOLEAN
        },
        data_cadastro: {
            type: DataTypes.DATE
        },
        data_exclusao: {
            type: DataTypes.DATE
        }
    }, {
        tableName: 'tbl_regra',
        timestamps: false
    })

    return Regra;
}