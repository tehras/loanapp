class AddCaseIdtoEmployee < ActiveRecord::Migration
  def change
    add_column :employees, :case_id, :integer
  end
end
