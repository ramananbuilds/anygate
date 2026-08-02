import { checkForUpdates, type UpdateStatus } from './update-check.js'

export async function checkSystemUpdates(): Promise<UpdateStatus> {
  return checkForUpdates()
}
