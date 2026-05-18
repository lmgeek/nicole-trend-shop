db = db.getSiblingDB(process.env.MONGO_INITDB_DATABASE || 'nicole-trend-shop');

db.createUser({
  user: process.env.MONGO_APP_USER || 'nicole_app',
  pwd: process.env.MONGO_APP_PASSWORD || 'nicole_app_password',
  roles: [
    { role: 'readWrite', db: process.env.MONGO_INITDB_DATABASE || 'nicole-trend-shop' }
  ]
});

print('Application user created successfully');
