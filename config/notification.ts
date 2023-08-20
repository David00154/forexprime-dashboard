/**
 *
 * Feel free to let us know via PR, if you find something broken in this config
 * file.
 */

import { NotificationConfig } from '@ioc:Verful/Notification'

/*
|--------------------------------------------------------------------------
| Notification Mapping
|--------------------------------------------------------------------------
|
| List of available notification channels. You must first define them
| inside the `contracts/notification.ts` file before mentioning them here.
|
*/
const NotificationConfig: NotificationConfig = {
  channel: 'mail',
  channels: {
    /*
    |--------------------------------------------------------------------------
    | Mail channel
    |--------------------------------------------------------------------------
    |
    | Use this channel to send notifications via email.
    |
    */
    mail: {
      driver: 'mail',
      mailer: 'smtp'
    },
  },
  notificationsTable: ''
}

export default NotificationConfig
