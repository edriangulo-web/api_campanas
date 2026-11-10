const jwt = require("jsonwebtoken");

const login = async (req, res, next) => {
  try {
    console.log(req.body);
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        error: "Debe ingresar usuairo y contraseña",
      });
    }

    const isValidAdmin = username == "admin" && password === "admin123";
    const isValidOperator =
      username === "operador" && password === "broxel2026";

    if (!isValidAdmin && !isValidOperator) {
      return res.status(401).json({
        error: "Credenciales invalidas:  usuario o contraseña incorrectos",
      });
    }

    const payload = isValidAdmin
      ? { id: "usr_admin_01", role: "ADMIN" }
      : { id: "usr_op_02", role: "OPERADOR" };

    const secret = process.env.JWT_SECRET || "clave_secreta_temporal_dev";

    const token = jwt.sign(payload, secret, { expiresIn: "8h" });

    return res.status(200).json({
      mensaje: "Autenticacion exitosa",
      usuario: {
        id: payload.id,
        username: payload.username,
        role: payload.role,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { login };
