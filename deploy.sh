cd static
npm run build:production
cd ..
gunicorn manage:app -b localhost:8000 --timeout 500
