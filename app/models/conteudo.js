module.exports = (sequelize, DataTypes) => {
    const Conteudo = sequelize.define('Conteudo', {
        id_conteudo: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        titulo: {
            type: DataTypes.STRING(45),
        },
        texto: {
            type: DataTypes.STRING,
        },
        tipo: {
            type: DataTypes.STRING(45)
        },
        data_criacao: {
            type: DataTypes.DATE
        },
        data_exclusao: {
            type: DataTypes.DATE
        },
        duracao: {
            type: DataTypes.INTEGER,
        },
        arquivo: {
            type: DataTypes.BLOB
        },
        id_regra: {
            type: DataTypes.INTEGER,
        },
        id_area_conhecimento: {
            type: DataTypes.INTEGER,
        }
    }, {
        tableName: 'tbl_conteudo',
        timestamps: false 
    });

    
    return Conteudo;
}