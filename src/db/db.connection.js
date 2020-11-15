const mongoose = require('mongoose');
const colors = require('colors/safe');

module.exports = async (connectionString) => {
  try {
    const option = {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    };
    const dbConn = await mongoose.connect(connectionString, option);
    console.log(colors.green(`[SERVER]: DB has been connected: ${dbConn.connection.host}`));
  } catch (err) {
    console.log(colors.red(`[SERVER]: DB connection error: ${err.message}`));
    process.exit(1);
  }
};
