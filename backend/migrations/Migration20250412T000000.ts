import { Migration } from '@mikro-orm/migrations';

export class Migration20250412T000000 extends Migration {
  public async up(): Promise<void> {
    this.addSql(
      "create table \"games\" (\"id\" serial primary key, \"steam_appid\" int not null, \"name\" text not null, \"price\" int not null, \"currency\" text not null, \"metadata\" jsonb null, \"player_peak\" int not null, \"created_at\" timestamptz not null default now(), \"updated_at\" timestamptz not null default now(), \"deleted_at\" timestamptz null);",
    );
    this.addSql('alter table "games" add constraint "games_steam_appid_unique" unique ("steam_appid");');

    this.addSql(
      "create table \"game_snapshots\" (\"id\" serial primary key, \"game_id\" int not null, \"price\" int not null, \"player_peak\" int not null, \"date\" date not null, \"created_at\" timestamptz not null default now(), \"updated_at\" timestamptz not null default now(), \"deleted_at\" timestamptz null);",
    );
    this.addSql(
      'alter table "game_snapshots" add constraint "game_snapshots_game_id_foreign" foreign key ("game_id") references "games" ("id") on update cascade on delete cascade;',
    );

    this.addSql(
      "create table \"users\" (\"id\" serial primary key, \"steam_id\" text not null, \"username\" text not null, \"avatar_url\" text not null, \"created_at\" timestamptz not null default now(), \"updated_at\" timestamptz not null default now(), \"deleted_at\" timestamptz null);",
    );
    this.addSql('alter table "users" add constraint "users_steam_id_unique" unique ("steam_id");');

    this.addSql(
      "create table \"user_prices\" (\"id\" serial primary key, \"user_id\" int not null, \"game_id\" int not null, \"pov_price\" int not null, \"created_at\" timestamptz not null default now(), \"updated_at\" timestamptz not null default now(), \"deleted_at\" timestamptz null);",
    );
    this.addSql(
      'alter table "user_prices" add constraint "user_prices_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade on delete cascade;',
    );
    this.addSql(
      'alter table "user_prices" add constraint "user_prices_game_id_foreign" foreign key ("game_id") references "games" ("id") on update cascade on delete cascade;',
    );
    this.addSql(
      'alter table "user_prices" add constraint "user_prices_user_id_game_id_unique" unique ("user_id", "game_id");',
    );
  }

  public async down(): Promise<void> {
    this.addSql('drop table if exists "user_prices" cascade;');
    this.addSql('drop table if exists "game_snapshots" cascade;');
    this.addSql('drop table if exists "users" cascade;');
    this.addSql('drop table if exists "games" cascade;');
  }
}
