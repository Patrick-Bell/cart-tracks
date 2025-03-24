class AddShowToManagers < ActiveRecord::Migration[7.2]
  def change
    add_column :managers, :show, :boolean, default: true
  end
end
