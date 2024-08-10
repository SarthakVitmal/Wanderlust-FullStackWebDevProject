const cron = require('node-cron');
const User = require('./models/user');

cron.schedule('0 * * * *', async () => {
  try {
    const oneHourAgo = new Date(Date.now() - 1 * 60 * 60 * 1000);

    await User.deleteMany({
      isEmailVerified: false,
      createdAt: { $lt: oneHourAgo }
    });
    console.log('Removed unverified users older than 1 hour');
  } catch (error) {
    console.error('Error removing unverified users:', error);
  }
});
