# BoilerPlates.Email_Lambda

[![Node.js](https://img.shields.io/badge/Node.js-22.x-green?logo=node.js)](https://nodejs.org)
[![AWS Lambda](https://img.shields.io/badge/AWS-Lambda-orange?logo=awslambda)](https://aws.amazon.com/lambda/)
[![Amazon SQS](https://img.shields.io/badge/AWS-SQS-FF9900?logo=amazonaws)](https://aws.amazon.com/sqs/)
[![Amazon SES](https://img.shields.io/badge/AWS-SES-3981BF?logo=amazonses)](https://aws.amazon.com/ses/)
[![Nodemailer](https://img.shields.io/badge/NPM-nodemailer-yellow?logo=npm)](https://nodemailer.com/)

Serverless boilerplate that consumes SQS messages and delivers richly formatted emails through Amazon SES. Messages describe recipients, subject, body content, and optional attachments. The Lambda worker converts each request into a raw MIME message with Nodemailer MailComposer before handing it off to SES.

---

## 📖 Overview

This project provides an **AWS Lambda function** that:

1. Listens to **Amazon SQS** for outbound email requests.
2. Parses each message for recipients, subject, body content, and attachments.
3. Uses **Nodemailer MailComposer** to build a raw MIME email (HTML, text, inline assets, attachments).
4. Sends the compiled message with **Amazon SES** via the AWS SDK for JavaScript (v3).

---

## ⚙️ Architecture

```
SQS → Lambda → MailComposer → Amazon SES (SendRawEmail)
```

---

## 🛠 Tech Stack

- **Runtime**: Node.js 22.x
- **AWS Services**: Lambda, Amazon SQS, Amazon SES
- **Libraries**:
  - [@aws-sdk/client-ses](https://github.com/aws/aws-sdk-js-v3) – SES client from the AWS SDK for JavaScript v3
  - [Nodemailer MailComposer](https://nodemailer.com/extras/mailcomposer/) – generates raw MIME payloads for SES

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
  "attachments": [
    { "fileKey": "my-reports/report.pdf" },
    { filename: "report.pdf", content: "[STREAM]" contentType: "application/octet-stream" }
  ],
  "to": ["recipient1@example.com", "recipient2@example.com"],
  "cc": ["manager@example.com"],
  "bcc": ["manager@example.com"],
  "subject": "Your weekly update",
  "html": "<h1>Weekly update</h1><p>Here is the latest report.</p>",
}
```

Supported fields:

- `to` (required): String or array of strings.
- `cc`, `bcc`, `replyTo` (optional): String or array of strings.
- `subject` (required): Email subject line.
- `html` (required): Email body as html.
- `attachments`/`files` (optional): String path or array of Nodemailer attachment objects (supports streams, base64 content, inline assets, etc.).

---

## 🚀 Deployment

Deploy with SAM, providing the SES identity you want to use as the sender:

```bash
sam deploy \
  --stack-name wizard-email-service \
  --parameter-overrides \
  S3Bucket="email-attachments" \
  SesSourceEmail="no-reply@example.com" \
  --capabilities CAPABILITY_IAM
```

Ensure the sender identity is **verified in Amazon SES** for the region where you deploy.

---

## 📝 License

MIT License. Use it, remix it, and build amazing email workflows.

---

👋 Created by [Elias Shekh](https://sheikhthewizard.world). Give the repo a ⭐ if it helped you!
