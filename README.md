# Nimo Industries API
This project provides serverless APIs for cryptocurrency price tracking and search functionality built on AWS Lambda.

**Note**  
This application does not use AWS Serverless from ```https://www.serverless.com``` or SST ```https://sst.dev``` which is a wrapper for AWS Lamda to manage everything on its own like creation of API Gateway, functions and deployment. This application was completely made from scratch using NodeJS and AWS SDK and SAM CLI to demonostrate the knowledge of AWS Lamba and different services of AWS Services.  

Deployment was also configured manually & CICD pipeline was configured using GithubActions.

## Project Structure
```md
nimo-crypto-api/
├── .github/
│   └── workflows/
│       └── deploy.yml      # CI/CD workflow for deployment
├── crypto-price/          # Cryptocurrency price API service
│   ├── src/
│   │   ├── config.js      # Database configuration
│   │   ├── email_conf.js  # Email service configuration
│   │   ├── main.js        # Lambda handler functions
│   │   ├── template.js    # Email template
│   │   └── utils.js       # Helper functions
│   ├── template.yaml      # AWS SAM template
│   └── package.json       # Node.js dependencies
├── crypto-search/         # Cryptocurrency search API service
│   ├── src/
│   │   ├── main.js        # Lambda handler functions
│   │   └── utils.js       # Helper functions
│   ├── template.yaml      # AWS SAM template
│   └── package.json       # Node.js dependencies
```
## Project Structure

## Services

## Crypto Price API
This service provides endpoints for:
* Fetching cryptocurrency prices from CoinGecko API
* Saving search history to a database
* Sending email notifications with price data

### EndPoints
* ```POST /crypto-price``` - Fetch cryptocurrency prices, save to DB, and send mail notification
```json
{
  "cryptoId": "bitcoin,ethereum", 
  "email": "user@example.com",
  "currencies": "usd,eur"
}
```
* ```POST /crypto-list``` - Retrieve cryptocurrency search history
```json
{
  "start_date": "2023-01-01", 
  "end_date": "2023-01-31",
  "cryptoId": "bitcoin"
}
```

## Crypto Search API
This service provides endpoints for:
* Searching cryptocurrency price history based on date range
* Retrieving and transforming historical data

## Endpoints
* ```POST /crypto-search``` - Search cryptocurrency history
```json
{
  "start_date": "2023-01-01", 
  "end_date": "2023-01-31",
  "cryptoId": "bitcoin"
}
```

## Setup & Deployment

### Prerequisites
* NodeJS 20.x
* AWS Account
* AWS CLI
* AWS SAM CLI

### Local Development
1. Install Dependencies
```shell
cd crypto-price && npm install
cd ../crypto-search && npm install
```
2. Create .env files in both service directories with the following:
```dotenv
AWS_SES_ACCESS_KEY_ID=your_access_key
AWS_SES_SECRET_ACCESS_KEY=your_secret_key
AWS_SES_REGION=your_region
DB_HOST=your_db_host
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_DATABASE=your_db_name
COIN_GEKO_API_KEY=your_coingecko_api_key
```
### Deployment
**Manual Deployment**
1. Build the SAM Application
```shell
cd crypto-price
sam build
```
2. Deploy to AWS
```shell
sam deploy --guided
```
3. Repeat for crypto-search directory

### CICD Deployment
THe project includes a GitHub Actions workflow in ``deploy.yml`` that automatically deploys both services when changes are pushed to the ```main``` branch.

## Database Schema
```sql
CREATE TABLE search_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  investor_id INT NOT NULL,
  crypto_currency VARCHAR(255) NOT NULL,
  data TEXT,
  created_at DATETIME NOT NULL
);
```

## Dependencies
* **Axios**: HTTP client for API Requests
* **dayjs**: Date handling library to convert date of making a query for crypto currency
* **dotenv**: environment variable management for local but dev stage its kept inside secret keys. check ```.env``` to know which secrets keys needs to be in github actions.
* **mysql2**: MySQL database client
* **Nodemailer**: Email Sending Functionality
* **aws-sdk**: AWS Services Integration

## Security Notes
* API keys and database credentials are stored as environment variables
* AWS SAM templates use parameters references to securely manage sensitive values.
* Email configuration uses GoogleSTMP with nodemailer as My SES Went SANDBOXED due to some security issues on aws.
