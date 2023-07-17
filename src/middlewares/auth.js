import { ADMIN_EMAIL, ADMIN_PASSWORD } from "../config.js";

export function isUser(req, res, next) {
    if (req.session?.user) {
        return next();
    }
    return res.status(401).render('error', { error: 'Error de autenticacion!' });
}
  
export function isAdmin(req, res, next) {
    if (req.session?.user.role === "admin") {
        return next();
    }
    return res.status(403).render('error', { error: 'Error de autorización!' });
}

export function adminAuthentication(req, res, next) {
    const { email, password } = req.body;
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD ) {
        req.session.user = { _id: '000', email: email, firstName: "Administrador", role: "admin" };
        return res.redirect('/products');
    }
    return next();
}