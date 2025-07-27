import bcrypt from 'bcrypt';

// Replace with your actual admin credentials
const email = 'jaybie1909@gmail.com';
const password = 'Rudi1984';

const generateHashes = async () => {
  const hashEmail = await bcrypt.hash(email, 12);
  const hashPassword = await bcrypt.hash(password, 12);

  console.log('ADMIN_EMAIL_HASH=', hashEmail);
  console.log('ADMIN_PASSWORD_HASH=', hashPassword);
};

generateHashes();
