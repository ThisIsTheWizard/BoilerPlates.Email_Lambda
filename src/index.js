import { sendEmailViaSes } from 'src/utils/ses'

const parseRecordMessage = (record) => {
  if (!record?.body) {
    throw new Error('Received SQS record without a body')
  }

  try {
    return JSON.parse(record.body)
  } catch (error) {
    const parsingError = new Error('Unable to parse SQS record body as JSON')
    parsingError.cause = error
    throw parsingError
  }
}

export const handler = async (event = {}) => {
  const records = event?.Records ?? []

  if (!records.length) {
    console.log('📭 [SES-LAMBDA] No SQS records to process')
    return {
      delivered: 0,
      failures: 0
    }
  }

  console.log(`🚀 [SES-LAMBDA] Processing ${records.length} SQS record(s) for email delivery`)

  const results = await Promise.allSettled(
    records.map(async (record) => {
      const messageId = record?.messageId ?? 'unknown'

      const emailPayload = parseRecordMessage(record)
      await sendEmailViaSes(emailPayload)

      console.log(`✉️ [SES-LAMBDA] Email sent successfully for message ${messageId}`)

      return messageId
    })
  )

  const failures = results.filter((result) => result.status === 'rejected')
  const delivered = results.length - failures.length

  if (failures.length) {
    failures.forEach((failure, index) => {
      console.error(`❌ [SES-LAMBDA] Failed to process message at index ${index}`, failure.reason)
    })

    const error = new Error(`Failed to send ${failures.length} of ${records.length} email(s)`)
    error.failures = failures.map((failure) => failure.reason)
    throw error
  }

  return {
    delivered,
    failures: 0
  }
}
