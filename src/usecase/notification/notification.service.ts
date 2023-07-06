import { Injectable } from '@nestjs/common';
import {FirebaseAdmin, InjectFirebaseAdmin} from "nestjs-firebase";

@Injectable()
export class NotificationService {
    constructor(
        @InjectFirebaseAdmin()
        private readonly firebase: FirebaseAdmin,
    ) {}

    sendNotificationAll()  {
        const message = {
            notification: {
                title: 'Hello',
                body: 'World',
            },
            topic: 'all',
        };
        return this.firebase.messaging.send(message);
    }
}
