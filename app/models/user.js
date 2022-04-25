module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id_usuario: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nome: {
            type: DataTypes.STRING(45),
        },
        sobrenome: {
            type: DataTypes.STRING(45),
        },
        mail: {
            type: DataTypes.STRING(100),
            unique: true
        },
        senha: {
            type: DataTypes.STRING(255),
        },
        inativo: {
            type: DataTypes.BOOLEAN,
        },
        data_cadastro: {
            type: DataTypes.DATE
        },
        data_exclusao: {
            type: DataTypes.DATE
        },
        perfil: {
            type: DataTypes.STRING(45),
        },
        resetPasswordToken: {
            type: DataTypes.STRING(45),
        }
    }, {
        tableName: 'tbl_usuario',
        timestamps: false 
    });

    
    return User;
}