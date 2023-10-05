import {Injectable} from "@nestjs/common";
import {FirebaseAdmin, InjectFirebaseAdmin} from "nestjs-firebase";
import {DeviceService} from "../device/device.service";
import {I18nService} from 'nestjs-i18n';
import {NotificationDataDto} from "./dto/notification-data.dto";

@Injectable()
export class NotificationService {
    constructor(
        @InjectFirebaseAdmin()
        private readonly firebase: FirebaseAdmin,
        private deviceService: DeviceService,
        private readonly i18n: I18nService
    ) {}
    async sendJobNotificationToUser(userId: string, body: string, data: NotificationDataDto) {
        // console log in gcp
        console.log('sendBasicNotificationToUser :', userId, body, data);
        this.deviceService.getDevicesInformation(userId).then(devices => {
            // console log in gcp
            console.log("devices:", devices);
            devices.forEach(device => {
                this.firebase.messaging.send({
                    token: device.token,
                    notification: {
                        title: 'IzzUp',
                        body: this.i18n.translate(`notification.${body}`, {
                            lang: device.language ,
                            args: {
                                job_title: data.job_title,
                                user_name: data.user_name,
                                verification_code: data.verification_code,
                            }
                        })
                    },
                    android: {
                        priority: 'high',
                    },
                    apns: {
                        headers: {
                            "apns-priority": "5",
                        },
                        payload: {
                            aps: {
                                contentAvailable: true,
                            }
                        }
                    },
                    data: {
                        type: data.type,
                        job_title: data.job_title || '',
                        starting_date: JSON.stringify(data.starting_date) || '',
                        verification_code: JSON.stringify(data.verification_code) || '',
                        request_id: data.request_id || '',
                    },
                }).then(r => console.log(r)).catch(e => console.log(e));
            });
        });
    }

    async sendBasicNotificationToUser(userId: string, body: string, data: NotificationDataDto) {
        // console log in gcp
        console.log('sendBasicNotificationToUser :', userId, body, data);
        this.deviceService.getDevicesInformation(userId).then(devices => {
            // console log in gcp
            console.log("devices:", devices);
            devices.forEach(device => {
                this.firebase.messaging.send({
                    token: device.token,
                    notification: {
                        title: 'IzzUp',
                        body: this.i18n.translate(`notification.${body}`, { lang: device.language })
                    },
                    android: {
                        priority: 'high',
                    },
                    apns: {
                        headers: {
                            "apns-priority": "5",
                        },
                        payload: {
                            aps: {
                                contentAvailable: true,
                            }
                        }
                    },
                    data: {
                        type: data.type || '',
                        room_id: data.room_id || '',
                    },
                }).then(r => console.log(r)).catch(e => console.log(e));
            });
        });
    }

    async sendMessageNotificationToUser(userId: string, title: string, body: string, data: NotificationDataDto) {
        // console log in gcp
        console.log('sendBasicNotificationToUser :', userId, body, data);
        this.deviceService.getDevicesInformation(userId).then(devices => {
            // console log in gcp
            console.log("devices:", devices);
            devices.forEach(device => {
                this.firebase.messaging.send({
                    token: device.token,
                    notification: {
                        title: title,
                        body: body
                    },
                    android: {
                        priority: 'high',
                    },
                    apns: {
                        headers: {
                            "apns-priority": "5",
                        },
                        payload: {
                            aps: {
                                contentAvailable: true,
                            }
                        }
                    },
                    data: {
                        type: data.type || '',
                        room_id: data.room_id || '',
                    },
                }).then(r => console.log(r)).catch(e => console.log(e));
            });
        });
    }
}
