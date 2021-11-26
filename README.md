# Quasar App (cookiecutter-quasar-supabase-pug)

An example Quasar app that connects to Supabase.io

This project was cloned from https://github.com/tequila99/quasar-supabase
and translated to English.

After downloading or cloning the directory:
1) Type npm install or yarn install
2) Create an '.env' file and add it to the top level dirctory with this content:

  VITE_SUPABASE_URL=<URL_from_your_supabase_account><br/>
  VITE_SUPABASE_ANON_KEY=<KEY_from_your_supabase_account>

3) Type quasar dev

If the initial page is blank, go to localhost:3000/login

Changes:
1) Added MagicLink login option


### Customize the configuration
See [Configuring quasar.conf.js](https://quasar.dev/quasar-cli/quasar-conf-js).
