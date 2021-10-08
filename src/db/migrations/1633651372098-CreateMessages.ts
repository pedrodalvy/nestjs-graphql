import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateMessages1633651372098 implements MigrationInterface {
  private table = new Table({
    name: 'messages',
    columns: [
      {
        name: 'id',
        type: 'INTEGER',
        isPrimary: true,
        isGenerated: true,
        generationStrategy: 'increment',
      },
      {
        name: 'user_id',
        type: 'INTEGER',
        isNullable: false,
      },
      {
        name: 'content',
        type: 'varchar',
        length: '255',
        isNullable: false,
      },
      {
        name: 'created_at',
        type: 'timestamptz',
        isNullable: false,
        default: 'now()',
      },
      {
        name: 'updated_at',
        type: 'timestamptz',
        isNullable: false,
        default: 'now()',
      },
    ],
  });

  private foreignKey = new TableForeignKey({
    columnNames: ['user_id'],
    referencedColumnNames: ['id'],
    onDelete: 'CASCADE',
    referencedTableName: 'users',
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this.table);
    await queryRunner.createForeignKey('messages', this.foreignKey);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this.table);
  }
}
