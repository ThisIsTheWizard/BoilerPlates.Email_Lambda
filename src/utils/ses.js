import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'

const UTF8 = 'UTF-8'

// Reuse a single SES client per container for connection reuse
const sesClient = new SESClient({})

const toArray = (value) => {
  if (!value) return []
  if (Array.isArray(value)) return value.filter(Boolean)
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
  }

  return []
}

export const normaliseMessage = (rawMessage = {}) => {
  const {
    to,
    recipients,
    subject,
    body,
    htmlBody,
    textBody,
    html,
    text,
    from,
    fromEmail,
    sender,
    replyTo,
    cc,
    bcc
  } = rawMessage

  const destinationTo = toArray(to ?? recipients)
  const destinationCc = toArray(cc)
  const destinationBcc = toArray(bcc)

  const resolvedSubject = subject?.toString()

  const source = (from ?? fromEmail ?? sender ?? process.env.SES_SOURCE_EMAIL)?.toString()

  const replyToAddresses = toArray(replyTo)

  const resolvedHtmlBody =
    typeof body === 'object' && body !== null
      ? body.html ?? body.htmlBody ?? body.Html
      : body

  const resolvedTextBody =
    typeof body === 'object' && body !== null
      ? body.text ?? body.textBody ?? body.Text
      : undefined

  const htmlContent = htmlBody ?? html ?? resolvedHtmlBody
  const textContent = textBody ?? text ?? resolvedTextBody

  return {
    to: destinationTo,
    cc: destinationCc,
    bcc: destinationBcc,
    subject: resolvedSubject,
    html: htmlContent?.toString(),
    text: textContent?.toString(),
    from: source,
    replyTo: replyToAddresses
  }
}

export const sendEmailViaSes = async (message = {}) => {
  const { to, cc, bcc, subject, html, text, from, replyTo } = normaliseMessage(message)

  if (!to?.length) {
    throw new Error('SES email requires at least one recipient')
  }

  if (!subject) {
    throw new Error('SES email requires a subject')
  }

  if (!html && !text) {
    throw new Error('SES email requires an HTML or text body')
  }

  if (!from) {
    throw new Error('SES email requires a source (from) address or SES_SOURCE_EMAIL env variable')
  }

  const command = new SendEmailCommand({
    Source: from,
    Destination: {
      ToAddresses: to,
      CcAddresses: cc,
      BccAddresses: bcc
    },
    ReplyToAddresses: replyTo?.length ? replyTo : undefined,
    Message: {
      Subject: {
        Data: subject,
        Charset: UTF8
      },
      Body: {
        ...(html
          ? {
              Html: {
                Data: html,
                Charset: UTF8
              }
            }
          : {}),
        ...(text
          ? {
              Text: {
                Data: text,
                Charset: UTF8
              }
            }
          : {})
      }
    }
  })

  return sesClient.send(command)
}
