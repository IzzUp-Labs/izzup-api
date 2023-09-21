import { Injectable } from "@nestjs/common";
import { FirebaseAdmin, InjectFirebaseAdmin } from "nestjs-firebase";
import {DeviceService} from "../device/device.service";

@Injectable()
export class NotificationService {
  constructor(
    @InjectFirebaseAdmin()
    private readonly firebase: FirebaseAdmin,
    private deviceService: DeviceService,
  ) {
  }

  sendNotificationToUser(userId: string) {
    this.deviceService.getFCMTokens(userId).then(tokens => {
        tokens.forEach(token => {
            this.firebase.messaging.send({
            token: token,
            notification: {
                title: "Hello",
                body: "World"
            },
            apns: {
                payload: {
                  aps: {
                      contentAvailable: true
                  }
                }
            }
            }).then(r => console.log(r)).catch(e => console.log(e));
        });
    });
  }
}
