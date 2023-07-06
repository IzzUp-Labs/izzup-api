import { Injectable } from '@nestjs/common';
import {FirebaseAdmin, InjectFirebaseAdmin} from "nestjs-firebase";

@Injectable()
export class NotificationService {
    constructor(
        @InjectFirebaseAdmin()
        private readonly firebase: FirebaseAdmin,
    ) {}

    sendNotificationToUser()  {
        this.firebase.messaging.send({
            token: 'cf9zoNPYTOmlVGLeS77O8I:APA91bHJi8al3G8nzEb-tVGCNxuYI7-PqBWmbeVKYhGwtpxc5NuIPE9NRk7aa02ya26hTwEnnuKpOKN3rKeiFB1H4EBc6G2SE3zOnCzBQ8c5W1H7Z5vfmBvZKPF0V257r7a8AlhQg4GN',
            notification: {
                title: 'Hello',
                body: 'World',
            },
            apns: {
                payload: {
                    aps: {
                        contentAvailable: true,
                    }
                }
            }
        }).then(r => console.log(r)).catch(e => console.log(e));
    }
}
