class AddLastSeenToManagers < ActiveRecord::Migration[7.2]
  def change
    add_column :managers, :last_seen, :date
  end
end
