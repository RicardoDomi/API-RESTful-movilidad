const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  changePassword,
  changeRole,
} = require("../controller/userController");

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Endpoints de gestión de usuarios
 */

//  Obtener todos los usuarios
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista de usuarios
 */
router.get("/", getAllUsers);

//  Obtener usuario por ID
/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Obtener usuario por ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *       404:
 *         description: Usuario no encontrado
 */
router.get("/:id", getUserById);

// Actualizar usuario
/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Actualizar usuario
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             username: juanp
 *             gmail: juan@example.com
 *             name: Juan Pérez
 *             phone: "5551234"
 *     responses:
 *       200: { description: Usuario actualizado correctamente }
 */
router.put("/:id", verifyToken, updateUser);
//  Eliminar usuario
/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Eliminar usuario
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Usuario eliminado correctamente }
 */
router.delete("/:id", verifyToken, deleteUser);

//  Cambiar contraseña
/**
 * @swagger
 * /users/{id}/password:
 *   patch:
 *     summary: Cambiar contraseña
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             currentPassword: anterior123
 *             newPassword: NuevaSegura!2025
 *     responses:
 *       200: { description: Contraseña actualizada correctamente }
 */
router.patch("/:id/password", verifyToken, changePassword);


/**
 * @swagger
 * /users/{id}/role:
 *   patch:
 *     summary: Cambiar rol de usuario
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             role: admin
 *     responses:
 *       200: { description: Rol actualizado correctamente }
 */
router.patch("/:id/role", verifyToken, changeRole);

module.exports = router;
