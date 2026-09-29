const app = require('./app');
const env = require('./config/env');

const server = app.listen(env.PORT, () => {
  console.log(`=======================================================`);
  console.log(`  🚀 TeenSpend API Server running on port ${env.PORT}`);
  console.log(`  🌍 Environment: ${env.NODE_ENV}`);
  console.log(`  📡 Health check: http://localhost:${env.PORT}/api/health`);
  console.log(`=======================================================`);
});

// Handle graceful shutdown
function handleGracefulShutdown(signal) {
  console.log(`\n🛑 Received ${signal}. Shutting down TeenSpend API gracefully...`);
  server.close(() => {
    console.log('✅ HTTP server closed. Process terminating.');
    process.exit(0);
  });

  // Force shutdown if taking too long
  setTimeout(() => {
    console.error('⚠️ Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));
process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));

module.exports = server;
