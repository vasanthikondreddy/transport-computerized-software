module.exports = function verifyRole(allowedRoles) {
  return function (req, res, next) {
    const userRole = req.user?.role;
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    console.log('Checking role:', userRole); // Optional debug

    if (!userRole || !roles.includes(userRole)) {
      return res.status(403).json({ message: 'Access denied: insufficient role' });
    }

    next();
  };
};
