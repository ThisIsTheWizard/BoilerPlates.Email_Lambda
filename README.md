# BoilerPlates.Email_Lambda

[![Node.js](https://img.shields.io/badge/Node.js-22.x-green?logo=node.js)](https://nodejs.org)
[![AWS Lambda](https://img.shields.io/badge/AWS-Lambda-orange?logo=awslambda)](https://aws.amazon.com/lambda/)
[![Amazon SQS](https://img.shields.io/badge/AWS-SQS-FF9900?logo=amazonaws)](https://aws.amazon.com/sqs/)
[![Amazon SES](https://img.shields.io/badge/AWS-SES-3981BF?logo=amazonses)](https://aws.amazon.com/ses/)

Serverless boilerplate that consumes SQS messages and delivers emails through Amazon SES. Each message describes the recipient list, subject, and HTML/text body, allowing the Lambda to act as an asynchronous email worker.

---

## 📖 Overview

This project provides an **AWS Lambda function** that:

1. Listens to **Amazon SQS** for outbound email requests.
2. Parses each message for recipients, subject, and body content.
3. Uses the modern **AWS SDK for JavaScript (v3)** to send the message via **Amazon SES**.
4. Supports multiple recipients across `to`, `cc`, `bcc`, and optional `replyTo` fields.

---

## ⚙️ Architecture

```
SQS → Lambda → Amazon SES
```

---

## 🛠 Tech Stack

- **Runtime**: Node.js 22.x
- **AWS Services**: Lambda, Amazon SQS, Amazon SES
- **Libraries**:
  - [@aws-sdk/client-ses](https://github.com/aws/aws-sdk-js-v3) – lightweight SES client from the AWS SDK for JavaScript v3

---

## 📦 Installation & Setup

Clone the repository and install dependencies:

```bash
git clone https://github.com/ThisIsTheWizard/BoilerPlates.Email_Lambda.git
cd BoilerPlates.Email_Lambda
npm install
```

Create a `.env.json` (or use another mechanism) that sets the SES sender address if it differs from the CloudFormation parameter:

```json
{
  "EmailService": {
    "SES_SOURCE_EMAIL": "no-reply@example.com"
  }
}
```

Run the project locally using the AWS SAM CLI:

```bash
npm run dev
```

---

## 📩 Example SQS Message Body

```json
{
  "from": "no-reply@example.com",
  "to": ["recipient1@example.com", "recipient2@example.com"],
  "cc": "manager@example.com",
  "subject": "Your weekly update",
  "body": {
    "html": "<h1>Weekly update</h1><p>Here is the latest report.</p>",
    "text": "Weekly update - Here is the latest report."
  }
}
```

Supported fields:

- `from` (optional): Overrides the default SES sender configured via environment variable.
- `to` (required): String or array of strings.
- `cc`, `bcc`, `replyTo` (optional): String or array of strings.
- `subject` (required): Email subject line.
- `body` (required): Can be a string (treated as HTML) or an object with `html`/`text` keys.
- `html`, `text`, `htmlBody`, `textBody` (optional): Direct overrides for body content.

---

## 🚀 Deployment

Deploy with SAM, providing the SES identity you want to use as the sender:

```bash
sam deploy \
  --stack-name wizard-email-service \
  --parameter-overrides SesSourceEmail=no-reply@example.com \
  --capabilities CAPABILITY_IAM
```

Ensure the sender identity is **verified in Amazon SES** for the region where you deploy.

---

## 📝 License

MIT License. Use it, remix it, and build amazing email workflows.

---

👋 Created by [Elias Shekh](https://sheikhthewizard.world). Give the repo a ⭐ if it helped you!
