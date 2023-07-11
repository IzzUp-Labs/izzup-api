import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { FirebaseModuleOptions, FirebaseModuleOptionsFactory } from "nestjs-firebase";

@Injectable()
export class FirebaseStorageService implements FirebaseModuleOptionsFactory {
  constructor(private configService: ConfigService) {
  }

  createFirebaseStorageAuth(): any {
    return {
      "type": this.configService.get("firebase.type"),
      "project_id": this.configService.get("firebase.project_id"),
      "private_key_id": this.configService.get("firebase.private_key_id"),
      "private_key": this.configService.get("firebase.private_key"),
      "client_email": this.configService.get("firebase.client_email"),
      "client_id": this.configService.get("firebase.client_id"),
      "auth_uri": this.configService.get("firebase.auth_uri"),
      "token_uri": this.configService.get("firebase.token_uri"),
      "auth_provider_x509_cert_url": this.configService.get("firebase.auth_provider_x509_cert_url"),
      "client_x509_cert_url": this.configService.get("firebase.client_x509_cert_url"),
      "universe_domain": this.configService.get("firebase.universe_domain")
    };
  }

  createFirebaseModuleOptions(): Promise<FirebaseModuleOptions> | FirebaseModuleOptions {
    return {
      googleApplicationCredential: this.createFirebaseStorageAuth()
    };
  }
}
