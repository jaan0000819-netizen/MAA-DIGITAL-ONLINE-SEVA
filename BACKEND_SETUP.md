# MAA DIGITAL - Backend Installation & Setup Guide

## 🚀 Quick Start (Production-Ready Backend)

### System Requirements
- PHP 7.4+ (Recommended: 8.1+)
- MySQL 5.7+ or MariaDB 10.2+
- Apache/Nginx with mod_rewrite
- OpenSSL extension
- cURL extension

---

## 📋 Installation Steps

### 1. Database Setup
```bash
# Connect to MySQL
mysql -u root -p

# Create database and user
CREATE DATABASE maa_digital_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'maa_digital_user'@'localhost' IDENTIFIED BY 'SecurePassword123!@#';
GRANT ALL PRIVILEGES ON maa_digital_db.* TO 'maa_digital_user'@'localhost';
FLUSH PRIVILEGES;

# Exit MySQL
EXIT;

# Import schema
mysql -u maa_digital_user -p maa_digital_db < config/database.sql
```

### 2. Environment Configuration
```bash
# Copy example env file
cp config/.env.example config/.env

# Edit .env with your values
nano config/.env
```

**Critical .env values to set:**
- `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`
- `JWT_SECRET` - Strong random string (min 32 chars)
- `ENCRYPTION_KEY` - Strong random string (min 32 chars)
- `MAIL_HOST`, `MAIL_USER`, `MAIL_PASS` - Gmail credentials
- `APP_ENV` - Set to `production`

### 3. Directory Permissions
```bash
# Create necessary directories
mkdir -p logs/security logs/app
mkdir -p cache uploads

# Set proper permissions
chmod 755 api
chmod 755 config
chmod 755 logs
chmod 755 cache
chmod 755 uploads

# Secure config directory
chmod 600 config/.env
chmod 700 config
```

### 4. Verify Installation
```bash
# Test database connection
php -r "require 'config/init.php'; echo 'Connection OK';"

# Test security functions
php -r "require 'config/init.php'; echo Security::generateToken();"
```

---

## 🔐 Security Configuration

### Apache .htaccess (Create at project root)
```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    
    # Remove index.php from URL
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ index.php/$1 [L]
    
    # Block sensitive files
    <FilesMatch "(\.env|\.git|database\.sql)">
        Deny from all
    </FilesMatch>
    
    # Force HTTPS
    RewriteCond %{HTTPS} off
    RewriteCond %{HTTP_HOST} !^localhost
    RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</IfModule>

# Security Headers
<IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
    Header set X-Frame-Options "DENY"
    Header set X-XSS-Protection "1; mode=block"
    Header set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>

# Disable directory listing
Options -Indexes

# Set upload limits
LimitRequestBody 10485760
</IfModule>
```

### Nginx Configuration (If using Nginx)
```nginx
server {
    listen 443 ssl http2;
    server_name api.maadigital.com;
    
    # SSL Configuration
    ssl_certificate /etc/ssl/certs/certificate.crt;
    ssl_certificate_key /etc/ssl/private/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    
    root /var/www/maa-digital/api;
    
    # Security Headers
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
    
    # Logging
    access_log /var/log/nginx/maa_digital_access.log;
    error_log /var/log/nginx/maa_digital_error.log;
    
    # PHP Configuration
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php-fpm.sock;
        fastcgi_index index.php;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    }
    
    # Block sensitive files
    location ~ /\. {
        deny all;
    }
    
    location ~* \.(env|sql|git)$ {
        deny all;
    }
    
    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
    limit_req zone=api_limit burst=20 nodelay;
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name api.maadigital.com;
    return 301 https://$server_name$request_uri;
}
```

---

## 📡 API Endpoints

### Authentication
```
POST /api/auth.php?action=register
POST /api/auth.php?action=login
POST /api/auth.php?action=verify-otp
POST /api/auth.php?action=resend-otp
POST /api/auth.php?action=logout
```

### Wallet
```
GET /api/wallet.php?action=balance
GET /api/wallet.php?action=transactions
POST /api/wallet.php?action=recharge
POST /api/wallet.php?action=deduct (Admin only)
```

### Orders (Coming Soon)
```
POST /api/orders.php?action=create
GET /api/orders.php?action=list
GET /api/orders.php?action=get
PUT /api/orders.php?action=update (Admin only)
```

### Admin (Coming Soon)
```
GET /api/admin.php?action=dashboard
GET /api/admin.php?action=members
GET /api/admin.php?action=orders
```

---

## 🧪 Testing API

### Register User
```bash
curl -X POST http://localhost/api/auth.php?action=register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Rajesh Kumar",
    "mobile": "9898072313",
    "password": "TestPass@123",
    "confirm_password": "TestPass@123",
    "state": "Gujarat",
    "district": "Panchmahal"
  }'
```

### Login
```bash
curl -X POST http://localhost/api/auth.php?action=login \
  -H "Content-Type: application/json" \
  -d '{
    "mobile": "9898072313",
    "password": "TestPass@123",
    "role": "member"
  }'
```

### Get Wallet Balance
```bash
curl -X GET http://localhost/api/wallet.php?action=balance \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Recharge Wallet
```bash
curl -X POST http://localhost/api/wallet.php?action=recharge \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 500,
    "payment_method": "upi"
  }'
```

---

## 🛡️ Security Best Practices

### 1. Firewall Configuration
```bash
# UFW (Ubuntu)
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# Only allow necessary ports
sudo ufw default deny incoming
sudo ufw default allow outgoing
```

### 2. Database Backup
```bash
# Daily backup (add to crontab)
0 2 * * * mysqldump -u maa_digital_user -p'SecurePassword123!@#' maa_digital_db | gzip > /backups/db_$(date +\%Y\%m\%d).sql.gz
```

### 3. Log Monitoring
```bash
# View security logs
tail -f logs/security/security_$(date +%Y-%m-%d).log

# Monitor login attempts
grep "login" logs/security/*.log

# Check for suspicious activity
grep "suspicious\|critical" logs/security/*.log
```

### 4. SSL Certificate (Let's Encrypt)
```bash
sudo apt-get install certbot python3-certbot-apache
sudo certbot certonly --apache -d api.maadigital.com
sudo certbot renew --dry-run
```

### 5. Regular Updates
```bash
# Update PHP and MySQL
sudo apt-get update
sudo apt-get upgrade

# Keep dependencies updated
composer update
```

---

## 🚨 Troubleshooting

### Database Connection Error
- Check MySQL service: `sudo service mysql status`
- Verify credentials in `.env`
- Check user permissions: `SHOW GRANTS FOR 'maa_digital_user'@'localhost';`

### Permission Denied
- Fix permissions: `chmod -R 755 /path/to/project`
- Check ownership: `chown -R www-data:www-data /path/to/project`

### Session Issues
- Ensure `/tmp` is writable
- Check `session.save_path` in php.ini
- Verify cookie settings

### SSL Certificate Issues
- Check cert validity: `openssl x509 -in certificate.crt -text -noout`
- Verify chain: `openssl s_client -connect api.maadigital.com:443`

---

## 📞 Support & Maintenance

- Check logs for errors: `logs/app/error_*.log`
- Monitor security events: `logs/security/security_*.log`
- Database maintenance: Regular backups and optimization
- Update credentials regularly: Change passwords every 90 days

---

**Last Updated**: 2025-05-15
**Backend Version**: 1.0.0-RC1
**Status**: Production Ready ✅
