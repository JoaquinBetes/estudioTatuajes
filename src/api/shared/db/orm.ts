import { MikroORM } from "@mikro-orm/core";
import { SqlHighlighter } from "@mikro-orm/sql-highlighter";
import { MySqlDriver } from "@mikro-orm/mysql";

export const orm = await MikroORM.init({
    entities: ['dist/**/*.entity.js'],
    entitiesTs: ['src/**/*.entity.js'],
    driver: MySqlDriver,
    dbName: 'estudiotattoo',
    clientUrl: 'mysql://root:genius123@localhost:3306/estudiotattoo',
    highlighter: new SqlHighlighter(),
    debug: true,
    timezone: 'Z',
    schemaGenerator: { // never in production
        disableForeignKeys: true,
        createForeignKeyConstraints: true,
        ignoreSchema: []
    }
})

export const syncSchema = async () => {
    const generator = orm.getSchemaGenerator();
    /*
    await generator.dropSchema();
    await generator.createSchema();
    */
    await generator.updateSchema();
}