const users = [
  { id: 1, username: "demo", name: "Usuario Demo", gmail: "demo@example.com", role: "user", phone: "555-1111" },
  { id: 2, username: "admin", name: "Administrador", gmail: "admin@example.com", role: "admin", phone: "555-2222" },
];

//  Obtener todos los usuarios
exports.getAllUsers = async (req, res) => {
  return res.json(users);
};

//  Obtener usuario por ID
exports.getUserById = async (req, res) => {
  const { id } = req.params;
  const user = users.find(u => u.id === Number(id));
  if (!user) return res.status(404).json({ message: "Usuario no encontrado (modo demo)" });
  return res.json(user);
};

//  Actualizar usuario
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  const user = users.find(u => u.id === Number(id));
  if (!user) return res.status(404).json({ message: "Usuario no encontrado (modo demo)" });

  Object.assign(user, data);
  return res.json({ message: "Usuario actualizado (modo demo)", data: user });
};

//  Eliminar usuario
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  const index = users.findIndex(u => u.id === Number(id));
  if (index === -1) return res.status(404).json({ message: "Usuario no encontrado (modo demo)" });

  users.splice(index, 1);
  return res.json({ message: "Usuario eliminado correctamente (modo demo)" });
};

// Cambiar contraseña
exports.changePassword = async (req, res) => {
  const { id } = req.params;
  const { currentPassword, newPassword } = req.body;

  const user = users.find(u => u.id === Number(id));
  if (!user) return res.status(404).json({ message: "Usuario no encontrado (modo demo)" });

  return res.json({ message: "Contraseña actualizada correctamente (modo demo)" });
};

//  Cambiar rol
exports.changeRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  const user = users.find(u => u.id === Number(id));
  if (!user) return res.status(404).json({ message: "Usuario no encontrado (modo demo)" });

  user.role = role;
  return res.json({ message: "Rol actualizado correctamente (modo demo)", data: user });
};
