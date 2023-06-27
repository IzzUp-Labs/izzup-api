import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {TagEntity} from "../../../../usecase/tag/entities/tag.entity";
import {Repository} from "typeorm";

@Injectable()
export class TagsSeedService {
    constructor(
         @InjectRepository(TagEntity)
         private repository: Repository<TagEntity>
    ) {}

    async run() {
        await this.createTag(1, 'Videur/Securité', '#0235ff');
        await this.createTag(2, 'Barista', '#a27a47');
        await this.createTag(3, 'Serveur', '#fffb00');
        await this.createTag(4, 'Plongeur', '#8fe8ff');
        await this.createTag(5, 'Cuisinier', '#67ff47');
        await this.createTag(6, 'Chef de cuisine', '#ff2424');
        await this.createTag(7, 'Commis de cuisine', '#b763ff');
        await this.createTag(8, 'Barman', '#ffffff');
        await this.createTag(9, 'Hôtesse', '#000000');
    }

    private async createTag(id: number, name: string, color: string) {
        const count = await this.repository.count({
            where: {
                id : id,
            },
        })

        if (count === 0) {
            await this.repository.save(
                this.repository.create({
                    id: id,
                    name,
                    color,
                }),
            );
        }
    }
}