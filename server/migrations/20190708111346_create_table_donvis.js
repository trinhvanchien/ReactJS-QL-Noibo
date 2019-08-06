exports.up = function(knex) {
  return knex.schema
  .createTable('donvis', function(table) {
      table.increments('dm_dv_id').primary();
      table.integer('dm_dv_id_cha');
      table.string('dm_dv_ten' , 50).notNullable();
      table.integer('dm_db_id_tinh').notNullable();
      table.integer('dm_db_id_huyen').notNullable();
      table.integer('dm_db_id_xa').notNullable();
      table.string('dm_dv_diachi', 50).notNullable();
      table.string('dm_dv_masothue',50);
      table.string('dm_dv_sodienthoai', 150);
      table.integer('kh_id_nguoidaidien');
      table.string('dm_dv_trangthai', 50);

      table.foreign('dm_dv_id_cha').references('dm_dv_id').inTable('donvis')
      table.foreign('kh_id_nguoidaidien').references('dm_dv_id').inTable('donvis')
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('donvis')
};