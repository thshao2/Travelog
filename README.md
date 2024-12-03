# Travelog

Production URLs:

- http://18.144.165.97
- http://ec2-18-144-165-97.us-west-1.compute.amazonaws.com/

To start the entire web application, run

```bash
npm start
```

To install all dependencies with npm in this project, run

```bash
npm run installs
```

## Deployment

```bash
cd /app/Travelog
git pull
npm run restart-backend-prod
npm run deploy-frontend
```
OR 

```bash
cd /app/Travelog
git pull
npm run deploy
```
## AWS S3 Development Access

Put your given AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in a `.env` file in /backend, shown below. Do not share your access and secret key with anyone, and do NOT push your `.env` file to GitHub!

--------------------------------------------------

```ini
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
AWS_REGION="us-west-1"
```
--------------------------------------------------