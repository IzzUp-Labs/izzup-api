import { Injectable } from "@nestjs/common";
import { FirebaseAdmin, InjectFirebaseAdmin } from "nestjs-firebase";
import {DeviceService} from "../device/device.service";
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class NotificationService {
  constructor(
    @InjectFirebaseAdmin()
    private readonly firebase: FirebaseAdmin,
    private deviceService: DeviceService,
    private readonly i18n: I18nService
  ) {
  }

  async sendNotificationToUser(userId: string, title: string, body: string, data: any) {
    this.deviceService.getDevicesInformation(userId).then(devices => {
        devices.forEach(device => {
            this.firebase.messaging.send({
            token: device.token,
            notification: {
                title: title,
                body: this.i18n.translate('notification.HELLO', { lang: device.language })
            },
            apns: {
                payload: {
                  aps: {
                      contentAvailable: true
                  }
                }
            },
                data: data
            }).then(r => console.log(r)).catch(e => console.log(e));
        });
    });
  }
}
