class AddModeToManagers < ActiveRecord::Migration[7.2]
  def change
    add_column :managers, :mode, :string, default: "light"
  end
end
