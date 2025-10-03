import { SendRawEmailCommand, SESClient } from '@aws-sdk/client-ses'
import { size } from 'lodash'
import MailComposer from 'nodemailer/lib/mail-composer'

import { getFileFromS3 } from 'src/utils/s3'

export const prepareAttachmentsFromFiles = async (attachments = []) => {
  try {
    const preparedAttachments = []

    for (const attachment of attachments) {
      if (attachment?.fileKey) {
        const file = await getFileFromS3(attachment.fileKey)
        if (file) {
          preparedAttachments.push({
            filename: attachment.filename || attachment.fileKey,
            content: file.Body,
            contentType: attachment.contentType || file.ContentType || 'application/octet-stream'
          })
        } else {
          console.warn(`⚠️ [EMAIL-LAMBDA] Attachment file not found in S3 at ${attachment.fileKey} ✨`)
        }
      } else if (attachment?.filename && attachment?.content) {
        preparedAttachments.push({
          filename: attachment.filename,
          content: attachment.content,
          contentType: attachment.contentType || 'application/octet-stream'
        })
      }
    }

    return preparedAttachments
  } catch (err) {
    console.error('❌ [EMAIL-LAMBDA] Error happened in prepareAttachmentsFromFiles 💥', err)
    throw err
  }
}

export const prepareMailOptions = async (body = {}) => {
  try {
    const { to, subject, text, html, cc, bcc, replyTo } = body

    if (!to) throw new Error('Missing "to" field in the email body')
    if (!subject) throw new Error('Missing "subject" field in the email body')
    if (!text && !html) throw new Error('Missing "text" or "html" field in the email body')

    const mailOptions = {
      from: process.env.AWS_SES_SOURCE_EMAIL || '',
      to,
      subject,
      text,
      html
    }

    if (cc) mailOptions.cc = cc
    if (bcc) mailOptions.bcc = bcc
    if (replyTo) mailOptions.replyTo = replyTo

    const attachments = await prepareAttachmentsFromFiles(body?.attachments || [])
    if (size(attachments)) mailOptions.attachments = attachments

    return mailOptions
  } catch (err) {
    console.error('❌ [EMAIL-LAMBDA] Error happened in prepareMailOptions 💥', err)
    throw err
  }
}

export const prepareRawMessageByMailComposer = async (body = {}) => {
  try {
    const mailOptions = await prepareMailOptions(body)

    console.log('🚀 [EMAIL-LAMBDA] Prepared mail options ✨', mailOptions)

    // Compiling email object to raw email data
    const composer = new MailComposer(mailOptions)
    const compiledContent = composer?.compile?.()

    // Keeping BCC emails in the email content
    compiledContent.keepBcc = true

    return compiledContent?.build?.()
  } catch (err) {
    console.error('❌ [EMAIL-LAMBDA] Error happened in prepareRawMessageByMailComposer 💥', err)
    throw err
  }
}

export const sendEmailUsingSES = async (body = {}) => {
  try {
    const rawMessage = await prepareRawMessageByMailComposer(body)
    if (!size(rawMessage)) {
      console.log('❌ [EMAIL-LAMBDA] Failed to prepare raw email message ✨', rawMessage)
      throw new Error('Failed to prepare raw email message')
    }

    const sesClient = new SESClient({})
    const response = await sesClient.send(new SendRawEmailCommand({ RawMessage: { Data: rawMessage } }))

    console.log('🚀 [EMAIL-LAMBDA] SES sendRawEmail response ✨', response)

    return { message: 'Email sent successfully!', success: true }
  } catch (err) {
    console.error('❌ [EMAIL-LAMBDA] Error happened in sendEmailUsingSES 💥', err)
    return { message: err?.message, success: false }
  }
}
