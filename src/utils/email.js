import { size } from 'lodash'

import { sendEmailUsingSES } from 'src/utils/ses'

export const initiateProcessingForSendingEmails = async (records = []) => {
  try {
    const promisesArray = []
    for (const record of records) {
      console.log('🚀 [EMAIL-LAMBDA] Processing record ✨', record)

      const body = JSON.parse(record?.body || '{}')

      promisesArray.push(sendEmailUsingSES(body))
    }

    const resArray = await Promise.all(promisesArray)
    if (size(promisesArray) && !size(resArray)) {
      console.log('🚀 [EMAIL-LAMBDA] Failed to send emails ✨')
    }

    for (const res of resArray) {
      console.log('🚀 [EMAIL-LAMBDA] Email sending response: ✨', res)
    }

    return true
  } catch (err) {
    console.error('❌ [EMAIL-LAMBDA] Error happened in initiateProcessingForSendingEmails 💥', err)
    throw err
  }
}
