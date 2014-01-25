class CreateEmployees < ActiveRecord::Migration
  def change
    create_table :employees do |t|
      t.string :first_name
      t.string :last_name
      t.string :email
      t.string :home_number
      t.string :mobile_number
      t.string :fax_number
      t.string :street
      t.string :city
      t.string :state
      t.string :zip
      t.string :nationality
      t.string :language
      t.integer :english
      t.integer :years_inUs
      t.string :hha_lic
      t.boolean :driver_lic
      t.boolean :access_toCar
      t.text :notes

      t.timestamps
    end
  end
end
