# !/bin/bash
rm -rf /var/www/coachcare/dashboard
mv /tmp/deployment/site/dashboard/ /var/www/coachcare
chown --recursive site:site /var/www/coachcare/dashboard