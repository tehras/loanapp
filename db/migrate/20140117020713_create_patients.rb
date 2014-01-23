class CreatePatients < ActiveRecord::Migration
  def change
    create_table :patients do |t|
      t.string :first_name
      t.string :last_name
      t.string :email
      t.string :home_phone
      t.string :mobile_phone
      t.string :fax_number
      t.string :street
      t.string :city
      t.string :state
      t.string :zip
      t.string :country
      t.string :nationality
      t.string :languages_spoken
      t.text :reasons_for_service
      t.string :type_of_service
      t.boolean :requires_car
      t.boolean :require_HHA
      t.text :required_services

      t.timestamps
    end
  end
end
