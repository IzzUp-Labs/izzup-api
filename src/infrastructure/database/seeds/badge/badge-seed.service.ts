import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {BadgeEntity} from "../../../../usecase/rating/entities/badge.entity";
import {Repository} from "typeorm";

@Injectable()
export class BadgeSeedService {
    constructor(
        @InjectRepository(BadgeEntity)
        private repository: Repository<BadgeEntity>
    ) {}

    async run() {
        await this.createBadge(
            "Ambiance",
            "Atmosphere",
            "Vous avez reçu cette récompense pour avoir créé une bonne ambiance de travail.",
            "You received this reward for creating a good working atmosphere.",
            "https://firebasestorage.googleapis.com/v0/b/izzup-119e8.appspot.com/o/badges%2Fatmosphere.png?alt=media&token=34e08b5f-8103-4b69-80b3-292cecf4c822",
            false
        );
        await this.createBadge(
            "A l'écoute",
            "Listening",
            "Vous avez reçu cette récompense pour avoir été à l'écoute de vos employées.",
            "You received this reward for listening to your employees.",
            "https://firebasestorage.googleapis.com/v0/b/izzup-119e8.appspot.com/o/badges%2Fattentive.png?alt=media&token=fb2ee8d2-6629-4471-94c1-8780fd6fe6ec",
            false
        );
        await this.createBadge(
            "Professionnel",
            "Professional",
            "Vous avez reçu cette récompense pour avoir été professionnel dans votre travail.",
            "You received this reward for being professional in your work.",
            "https://firebasestorage.googleapis.com/v0/b/izzup-119e8.appspot.com/o/badges%2Fprofessional.png?alt=media&token=f699c37c-7888-4667-9fd8-bb6d9f724e48",
            false
        );
        await this.createBadge(
            "Efficace",
            "Efficient",
            "Vous avez reçu cette récompense pour avoir été efficace dans votre travail.",
            "You received this reward for being efficient in your work.",
            "https://firebasestorage.googleapis.com/v0/b/izzup-119e8.appspot.com/o/badges%2Fefficient.png?alt=media&token=74d76ceb-1b82-46cf-ad57-13f3cc5ae503",
            true
        );
        await this.createBadge(
            "Amical",
            "Friendly",
            "Vous avez reçu cette récompense pour avoir été amical au travail.",
            "You received this reward for being friendly at work.",
            "https://firebasestorage.googleapis.com/v0/b/izzup-119e8.appspot.com/o/badges%2Ffriendly.png?alt=media&token=c71ec010-5cbc-486d-9a07-a5f06167efd6",
            true
        );
        await this.createBadge(
            "Ponctuel",
            "Punctual",
            "Vous avez reçu cette récompense pour avoir été ponctuel au travail.",
            "You received this reward for being punctual at work.",
            "https://firebasestorage.googleapis.com/v0/b/izzup-119e8.appspot.com/o/badges%2Fpunctual.png?alt=media&token=1186fbe5-fdd0-436b-ab43-4939286094b4",
            true
        );
    }

    private async createBadge(name_fr: string, name_en: string, description_fr: string, description_en: string, image: string, is_extra: boolean) {
        const badge = new BadgeEntity();
        badge.name_fr = name_fr;
        badge.name_en = name_en;
        badge.description_fr = description_fr;
        badge.description_en = description_en;
        badge.image = image;
        badge.is_extra = is_extra;
        return this.repository.save(badge);
    }
}