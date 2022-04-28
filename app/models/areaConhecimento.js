module.exports = (sequelize, DataTypes) => {
    const areaConhecimento = sequelize.define('areaConhecimento', {
        id_area_conhecimento: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nome: {
            type: DataTypes.STRING(45),
        },
        nome_curto: {
            type: DataTypes.STRING(15),
        },
        descricao: {
            type: DataTypes.STRING(400),
        },
        imagem: {
            type: DataTypes.BLOB,
        },
        ativo: {
            type: DataTypes.BOOLEAN,
        },
        data_criacao: {
            type: DataTypes.DATE
        },
        data_exclusao: {
            type: DataTypes.DATE
        },
        id_professor: {
            type: DataTypes.INTEGER,
        },
        tokens_entrada: {
            type: DataTypes.JSON,
            defaultValue: {
                tokens: [null]
            }
        }
    }, {
        tableName: 'tbl_area_conhecimento',
        timestamps: false 
    });

    
    return areaConhecimento;
}