class AddEmployeeIdToCase < ActiveRecord::Migration
  def change
    add_column :cases, :employee_id, :integer
  end
end
