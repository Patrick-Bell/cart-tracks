class ChangeLastSeenToDatetimeInManagers < ActiveRecord::Migration[7.2]
  def change
    change_column :managers, :last_seen, :datetime
  end
end
