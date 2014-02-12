class AddPatientIdToCase < ActiveRecord::Migration
  def change
    add_column :cases, :patient_id, :integer
  end
end
