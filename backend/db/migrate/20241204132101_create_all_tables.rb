class CreateAllTables < ActiveRecord::Migration[7.2]
  def change
    # Create all tables
    create_table :active_storage_blobs do |t|
      t.string :key, null: false
      t.string :filename, null: false
      t.string :content_type
      t.text :metadata
      t.string :service_name, null: false
      t.bigint :byte_size, null: false
      t.string :checksum
      t.datetime :created_at, null: false
      t.index :key, unique: true
    end

    create_table :active_storage_attachments do |t|
      t.string :name, null: false
      t.string :record_type, null: false
      t.bigint :record_id, null: false
      t.bigint :blob_id, null: false
      t.datetime :created_at, null: false
      t.index :blob_id
      t.index [:record_type, :record_id, :name, :blob_id], unique: true, name: "index_active_storage_attachments_uniqueness"
    end

    create_table :active_storage_variant_records do |t|
      t.bigint :blob_id, null: false
      t.string :variation_digest, null: false
      t.index [:blob_id, :variation_digest], unique: true
    end

    create_table :workers do |t|
      t.string :name
      t.string :email
      t.string :phone_number
      t.string :address
      t.date :joined
      t.string :last_name
      t.boolean :watching, default: false
      t.datetime :created_at, null: false
      t.datetime :updated_at, null: false
    end

    create_table :managers do |t|
      t.string :name
      t.string :email
      t.string :password_digest
      t.string :phone_number
      t.string :last_name
      t.string :access
      t.string :role
      t.boolean :online
      t.boolean :notifications, default: true
      t.datetime :created_at, null: false
      t.datetime :updated_at, null: false
    end

    create_table :fixtures do |t|
      t.string :home_team
      t.string :away_team
      t.string :stadium
      t.integer :capacity
      t.string :home_icon
      t.string :away_icon
      t.datetime :date
      t.string :home_team_abb
      t.string :away_team_abb
      t.string :name
      t.string :competition
      t.datetime :created_at, null: false
      t.datetime :updated_at, null: false
    end

    create_table :games do |t|
      t.string :name
      t.date :date
      t.integer :manager_id, null: false
      t.boolean :complete_status, default: false
      t.integer :fixture_id
      t.datetime :created_at, null: false
      t.datetime :updated_at, null: false
      t.index :fixture_id
      t.index :manager_id
    end

    create_table :carts do |t|
      t.string :cart_number
      t.integer :quantities_start
      t.integer :quantities_added
      t.integer :quantities_minus
      t.integer :final_quantity
      t.integer :final_returns
      t.float :total_value
      t.integer :game_id, null: false
      t.datetime :created_at, null: false
      t.datetime :updated_at, null: false
      t.integer :float
      t.float :worker_total
      t.date :date
      t.integer :sold
      t.index :game_id
    end

    create_table :cart_workers do |t|
      t.integer :cart_id, null: false
      t.integer :worker_id, null: false
      t.datetime :created_at, null: false
      t.datetime :updated_at, null: false
      t.index :cart_id
      t.index :worker_id
    end

    create_table :messages do |t|
      t.string :content
      t.integer :manager_id
      t.datetime :created_at, null: false
      t.datetime :updated_at, null: false
      t.index :manager_id
    end

    # Add Foreign Keys
    add_foreign_key :active_storage_attachments, :active_storage_blobs, column: :blob_id
    add_foreign_key :active_storage_variant_records, :active_storage_blobs, column: :blob_id
    add_foreign_key :cart_workers, :carts
    add_foreign_key :cart_workers, :workers
    add_foreign_key :carts, :games
    add_foreign_key :games, :fixtures
    add_foreign_key :games, :managers
    add_foreign_key :messages, :managers
  end
end
