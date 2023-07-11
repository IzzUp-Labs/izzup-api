import { Injectable } from "@nestjs/common";
import { FirebaseAdmin, InjectFirebaseAdmin } from "nestjs-firebase";

@Injectable()
export class NotificationService {
  constructor(
    @InjectFirebaseAdmin()
    private readonly firebase: FirebaseAdmin
  ) {
  }

  sendNotificationToUser() {
    this.firebase.messaging.send({
      token: "ewG2CuaUTDemMade9kEcWz:APA91bHfKUsoS5ynblg59eYaqDGfiGatO9CDQE7Avok9lKg3thdf2jHPe0YC3DAl3WqHj6Hj0f0Kd62lfUnnrDEYjq3DntfAkqzn8azu4J-zZchwyXS988u_0jDJua5ok-mklkPnAT55",
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
  }
}
