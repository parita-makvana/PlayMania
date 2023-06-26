const addUser = async (req, res) => {
  try {
    const { username, role, dob, email, password } = req.body;
    const hashed_password = bcrypt.hashSync(
      password,
      Number(process.env.SALT_ROUNDS)
    );

    const user_id = uuidv4();

    sequelize
      // .sync({ force: true })
      .sync()
      .then((result) => {
        //console.log(result);

        return User.create({
          user_id: user_id,
          username: username,
          role: role,
          dob: dob,
          email: email,
          hashed_password: hashed_password,
        });
      });

    res.status(200).json({ message: 'User created successfulyy!' });
  } catch (error) {
    console.error('Error while registering, register again....', error);
    res.status(500).json({ message: 'Internal Server Error..' });
  }
};

module.exports = addUser;
