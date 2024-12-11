# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.2].define(version: 2024_12_11_194856) do
  create_schema "auth"
  create_schema "extensions"
  create_schema "graphql"
  create_schema "graphql_public"
  create_schema "pgbouncer"
  create_schema "pgsodium"
  create_schema "pgsodium_masks"
  create_schema "realtime"
  create_schema "storage"
  create_schema "vault"

  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_graphql"
  enable_extension "pg_stat_statements"
  enable_extension "pgcrypto"
  enable_extension "pgjwt"
  enable_extension "pgsodium"
  enable_extension "plpgsql"
  enable_extension "supabase_vault"
  enable_extension "uuid-ossp"

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.string "service_name", null: false
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "idx_on_blob_id_variation_digest_f36bede0d9", unique: true
  end

  create_table "cart_workers", force: :cascade do |t|
    t.integer "cart_id", null: false
    t.integer "worker_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["cart_id"], name: "index_cart_workers_on_cart_id"
    t.index ["worker_id"], name: "index_cart_workers_on_worker_id"
  end

  create_table "carts", force: :cascade do |t|
    t.string "cart_number"
    t.integer "quantities_start"
    t.integer "quantities_added"
    t.integer "quantities_minus"
    t.integer "final_quantity"
    t.integer "final_returns"
    t.float "total_value"
    t.integer "game_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "float"
    t.float "worker_total"
    t.date "date"
    t.integer "sold"
    t.index ["game_id"], name: "index_carts_on_game_id"
  end

  create_table "fixtures", force: :cascade do |t|
    t.string "home_team"
    t.string "away_team"
    t.string "stadium"
    t.integer "capacity"
    t.string "home_icon"
    t.string "away_icon"
    t.datetime "date"
    t.string "home_team_abb"
    t.string "away_team_abb"
    t.string "name"
    t.string "competition"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "games", force: :cascade do |t|
    t.string "name"
    t.date "date"
    t.integer "manager_id", null: false
    t.boolean "complete_status", default: false
    t.integer "fixture_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["fixture_id"], name: "index_games_on_fixture_id"
    t.index ["manager_id"], name: "index_games_on_manager_id"
  end

  create_table "managers", force: :cascade do |t|
    t.string "name"
    t.string "email"
    t.string "password_digest"
    t.string "phone_number"
    t.string "last_name"
    t.string "access"
    t.string "role"
    t.boolean "online"
    t.boolean "notifications", default: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "last_seen"
    t.string "mode", default: "light"
  end

  create_table "messages", force: :cascade do |t|
    t.string "content"
    t.integer "manager_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["manager_id"], name: "index_messages_on_manager_id"
  end

  create_table "workers", force: :cascade do |t|
    t.string "name"
    t.string "email"
    t.string "phone_number"
    t.string "address"
    t.date "joined"
    t.string "last_name"
    t.boolean "watching", default: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "cart_workers", "carts"
  add_foreign_key "cart_workers", "workers"
  add_foreign_key "carts", "games"
  add_foreign_key "games", "fixtures"
  add_foreign_key "games", "managers"
  add_foreign_key "messages", "managers"
end
