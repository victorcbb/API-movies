const knex = require('../database/knex')
const AppError = require('../utils/AppError')
const { hash, compare } = require('bcryptjs')

class UsersController {
  async create(req, res) {
    const { name, email, password } = req.body

    const checkUserExist = await knex("users").where({ email }).first()

    if(checkUserExist) {
      throw new AppError("Este e-mail já está em uso.")
    }

    const hashedPassword = await hash(password, 8)

    await knex("users").insert({
      name,
      email,
      password: hashedPassword
    })

    return res.status(201).json()
  }

  async update(req, res) {
    const { name, email, password, old_password } = req.body
    const user_id = req.user.id

    const user = await knex("users").where({ id: user_id }).first()

    if(!user) {
      throw new AppError("Usuário não encontrado")
    }

    const userWithUpdatedEmail = await knex("users").where({ email }).first()

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError("Este e-mail já está em uso")
    }

    user.name = name ?? user.name
    user.email = email ?? user.email

    if(password && !old_password) {
      throw new AppError("Insira a senha antiga.")
    }

    if(!password && old_password) {
      throw new AppError("Insira uma nova senha para ser definida.")
    }

    if(password && old_password) {
      const chechOldPassword = await compare(old_password, user.password)

      if (!chechOldPassword) {
        throw new AppError("Senha antiga não confere.")
      }

      user.password = await hash(password, 8)
    }

    await knex("users").update({
      name,
      email,
      password: user.password,
      updated_at: knex.fn.now()
    }).where("id", user.id)

    return res.json()
  }
}

module.exports = UsersController
