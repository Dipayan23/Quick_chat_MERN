import jwt from 'jsonwebtoken';

// Function to generate a JWT token
export const generateToken = (userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token validity period
  });
  return token;
}