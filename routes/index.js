const authRoutes=require("./auth");
const userRoutes=require("./users");

exports.routes = (app) => {
    app.use('/',authRoutes);
    app.use('/',userRoutes);
}