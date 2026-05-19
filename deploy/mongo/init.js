db = db.getSiblingDB(process.env.MONGO_INITDB_DATABASE || 'nicole-trend-shop');

var appUser = process.env.MONGO_APP_USER || 'nicole_app';
var appPwd = process.env.MONGO_APP_PASSWORD || 'changeme_app_password_strong';
var dbName = process.env.MONGO_INITDB_DATABASE || 'nicole-trend-shop';

var existingUser = db.getUser(appUser);
if (!existingUser) {
    db.createUser({
        user: appUser,
        pwd: appPwd,
        roles: [
            { role: 'readWrite', db: dbName }
        ]
    });
    print('Application user "' + appUser + '" created successfully');
} else {
    print('Application user "' + appUser + '" already exists, skipping');
}
