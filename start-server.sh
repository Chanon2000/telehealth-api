#!/bin/sh

until mysqladmin ping --host=$DB_HOST --user=$DB_USER --password=$MYSQL_ROOT_PASSWORD --silent; do
  echo "Waiting for MySQL to be ready..."
  sleep 2
done

echo "MySQL is up"
npm run migrate
npm run dev