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
}

module.exports = UsersController
