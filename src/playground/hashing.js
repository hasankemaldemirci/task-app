const bcrypt = require('bcryptjs')

const password = '12345678'
const h = '$2a$08$3/6LjTk9zuasgfP7oo5v5.IvnsCieQS8cG92FaO9O2xOLaUSNrM6a'

const hashPassword = async (password) => {
  
  const hashed = await bcrypt.hash('1234567', 8)
  
  return hashed
}

const comparePassword = async (password, hashedPassword) => {
  const isMatch = await bcrypt.compare(password, h)

  return isMatch
}


hashPassword(password).then(hashed => {
  let hashedPassword = hashed
 
  comparePassword(password, hashedPassword).then(isMatch => {
    console.log(isMatch)
  }) 
})



