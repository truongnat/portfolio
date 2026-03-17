# Preview Environment Setup

## One-time server setup (run on Lightsail once)

```bash
# 1. Create preview web root
sudo mkdir -p /var/www/preview
sudo chown -R www-data:www-data /var/www/preview

# 2. Create basic auth password (replace YOUR_PASSWORD)
sudo apt install apache2-utils -y
sudo htpasswd -c /etc/nginx/.htpasswd-preview preview
# Enter password when prompted

# 3. Add DNS record
# In your DNS provider: A record → preview.truongdq.com → same Lightsail IP

# 4. Copy nginx config
sudo cp nginx.conf /etc/nginx/sites-available/default
sudo nginx -t && sudo systemctl reload nginx

# 5. (Optional) SSL with certbot
sudo certbot --nginx -d truongdq.com -d www.truongdq.com -d preview.truongdq.com
```

## Workflow

```bash
# Make changes
git checkout preview
git merge main          # or cherry-pick specific commits
git push origin preview # → triggers preview deploy automatically

# Preview at: https://preview.truongdq.com (password protected)

# When happy, merge to production
git checkout main
git merge preview
git push origin main    # → triggers production deploy
```
