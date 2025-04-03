class UpdateDefaultsForManagers < ActiveRecord::Migration[7.2]
  def change
    change_column_default :managers, :notifications, false
    change_column_default :managers, :access, "high"
    change_column_default :managers, :role, "admin"
  end
end
