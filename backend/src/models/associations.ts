import Citations from "./citation.model";
import Dep from "./dep.model";
import Departments from "./department.model";
import Publications from "./publication.model";

// I need to do that because sequelize is trolling and cant see the others tables if they are in different
// files and had to import all here and add the associations
export const runAssociations = () => {
    Publications.belongsTo(Dep, { foreignKey: 'id' });
    Citations.belongsTo(Dep, { foreignKey: 'id' });
    Dep.belongsTo(Departments, { foreignKey: 'inst' });
    Dep.hasOne(Citations, { foreignKey: 'id' });
    Dep.hasOne(Publications, { foreignKey: 'id' });
    Departments.hasMany(Dep, { foreignKey: 'inst' });
}

