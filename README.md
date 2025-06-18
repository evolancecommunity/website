# Deployment Instructions

This project contains a FastAPI backend and React frontend. To deploy the backend to Heroku:

1. Ensure you have the Heroku CLI installed and you are logged in with `heroku login`.
2. Create a new Heroku app:

   ```bash
   heroku create YOUR_APP_NAME
   ```

3. Set required environment variables:

   ```bash
   heroku config:set MONGO_URL=your_mongo_url DB_NAME=evolance
   heroku config:set EMAILJS_API_KEY=your_emailjs_key EMAILJS_ACCOUNT_ID=your_emailjs_account
   ```

4. Push the repository to Heroku:

   ```bash
   git push heroku work:main
   ```

Heroku will use the included `Procfile` to launch the backend using Uvicorn.
