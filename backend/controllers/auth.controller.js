import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' })

    const exists = await User.findOne({ email })
    if (exists) return res.status(409).json({ message: 'Email already registered' })

    const passwordHash = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, passwordHash })

    return res.status(201).json({ id: user._id })
  } catch (e) { next(e) }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(401).json({ message: 'Invalid credentials' })

    const ok = await user.comparePassword(password)
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' })

    const token = jwt.sign({ id: user._id, email: user.email, name: user.name }, process.env.JWT_SECRET, { expiresIn: '7d' })
    return res.json({ token, user: { id: user._id, name: user.name, email: user.email } })
  } catch (e) { next(e) }
}
