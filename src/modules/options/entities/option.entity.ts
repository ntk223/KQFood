import { BaseEntity } from "@/base/base.entity";
import { OptionGroup } from "@/modules/option-groups/entities/option-group.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
@Entity('options')
export class Option extends BaseEntity {


    @Column({ nullable: false, type: 'int' })
    groupId: number;

    @Column({ nullable: false, type: 'varchar' })
    name: string;

    @Column({default: 0, type: 'numeric'})
    priceAdjustment: number;

    @Column({ default: true })
    isAvailable: boolean;    
    
    @ManyToOne(() => OptionGroup, (optionGroup) => optionGroup.options)
    @JoinColumn({ name: 'group_id' })
    optionGroup: OptionGroup;
}
