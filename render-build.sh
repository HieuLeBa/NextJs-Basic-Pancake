#!/usr/bin/env bash
# exit on error
set -o errexit

if ! gem list foreman -i --silent; then
  echo "Installing foreman..."
  gem install foreman
fi

bundle install
yarn install
bundle exec rails yarn:install
bundle exec rails tailwindcss:build
bundle exec rails tailwindcss:watch
bundle exec rails assets:precompile
bundle exec rails assets:clean
bundle exec rails db:create
bundle exec rails db:migrate