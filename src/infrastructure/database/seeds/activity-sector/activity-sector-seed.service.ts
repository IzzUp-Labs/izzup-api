import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {ActivitySectorEntity} from "../../../../usecase/activity-sector/entities/activity-sector.entity";
import {Repository} from "typeorm";

@Injectable()
export class ActivitySectorSeedService {
    constructor(
       @InjectRepository(ActivitySectorEntity)
       private repository: Repository<ActivitySectorEntity>
    ) {}

    async run() {
        await this.createActivitySector(1, 'Restauration');
        await this.createActivitySector(2, 'Hôtellerie');
        await this.createActivitySector(3, 'Evénementiel');
        await this.createActivitySector(4, 'Tourisme');
        await this.createActivitySector(5, 'Autres');
    }

    private async createActivitySector(id: number, name: string) {
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
                }),
            );
        }
    }
}