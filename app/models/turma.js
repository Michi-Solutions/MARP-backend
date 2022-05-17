module.exports = (sequelize, DataTypes) => {
    const Turma = sequelize.define('Turma', {
        id_usuario: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        id_area_conhecimento: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
    }, {
        tableName: 'tbl_turma',
        timestamps: false,
        freezeTableName: true
    })
    Turma.removeAttribute('id');
    return Turma;
}

