import { initiateProcessingForSendingEmails } from 'src/utils/email'

export const handler = async (event, context, callback) => {
  try {
    console.log('🚀 [EMAIL-LAMBDA] Lambda process is started with event ✨', event)

    return initiateProcessingForSendingEmails(event?.Records || [])
  } catch (error) {
    console.error('❌ [EMAIL-LAMBDA] Error happened in handler 💥', error)
  } finally {
    callback(null, 'Lambda process is completed')
  }
}
