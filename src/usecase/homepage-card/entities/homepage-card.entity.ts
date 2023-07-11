import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("homepage_card")
export class HomepageCardEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 50, nullable: false })
  title: string;

  @Column({ type: "varchar", length: 100, nullable: false })
  description: string;

  @Column({ type: "varchar", nullable: true })
  photo: string;

  @Column({ type: "varchar", length: 20, nullable: false })
  type: string;

  @Column({ type: "varchar", nullable: true })
  link: string;

  @Column({ nullable: true })
  company_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
