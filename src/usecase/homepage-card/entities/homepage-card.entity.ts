import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('homepage_card')
export class HomepageCardEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column( {type: 'varchar', length: 50, nullable: false} )
  title: string;

  @Column( {type: 'varchar', length: 100, nullable: false} )
  description: string;

  @Column( {type: 'varchar', nullable: true} )
  photo: string;

  @Column( {type: 'varchar', length: 20, nullable: false} )
  type: string;

  @Column( {type: 'varchar', length: 100, nullable: true} )
  link: string;

  @Column( {type: 'varchar', length: 100, nullable: true} )
  company_id: number;
}