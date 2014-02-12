class AddCaseIdtoPatient < ActiveRecord::Migration
  def change
    add_column :patients, :case_id, :integer
  end
end
