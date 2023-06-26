import * as process from "process";
import { registerAs } from "@nestjs/config";

export default registerAs("firebase", () => ({
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/gm, "\n"),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
    universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
    storage_name: process.env.FIREBASE_STORAGE_URL,
    image_bucket_name: process.env.FIREBASE_STORAGE_IMAGE_BUCKET_IMAGE,
    homepage_bucket_name: process.env.FIREBASE_STORAGE_IMAGE_BUCKET_HOMEPAGE_CARD,
    id_bucket_name: process.env.FIREBASE_STORAGE_IMAGE_BUCKET_ID
}));