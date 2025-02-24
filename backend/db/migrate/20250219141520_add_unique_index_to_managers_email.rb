class AddUniqueIndexToManagersEmail < ActiveRecord::Migration[7.2]
  def change
    add_index :managers, :email, unique: true
  end
end
