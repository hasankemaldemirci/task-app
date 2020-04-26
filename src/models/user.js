const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Email is invalid!')
        }
      }
    },
    password: {
      type: String,
      trim: true,
      minlength: 7,
      validate(value) {
        if (value.toLowerCase().includes('password')) {
          throw new Error('Password value can not contain the word "password"')
        }
      }
    },
    age: {
      type: Number,
      default: 0,
      validate(value) {
        if (value < 0) {
          throw new Error('Age must be greater than or equal to 0')
        }
      }
    },
    tokens: [{
      token: {
        type: String,
        require: true
      }
    }]
  },
  {
    timestamps: true,
    versionKey: false
  }
)

userSchema.methods.toJSON = function () {
  const user = this
  const userObject = user.toObject()

  delete userObject.createdAt
  delete userObject.updatedAt
  delete userObject.password
  delete userObject.tokens

  return userObject
}

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email })

  if (!user) {
    throw new Error('Unable to login!')
  }

  console.log(password, user.password)

  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) {
    throw new Error('Unable to login!')
  }

  return user
}

userSchema.pre('save', async function (next) {
  const user = this
  
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }

  next()
})

const User = mongoose.model('User', userSchema)

module.exports = User
