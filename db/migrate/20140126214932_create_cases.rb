class CreateCases < ActiveRecord::Migration
  def change
    create_table :cases do |t|
      t.string :start_date
      t.string :end_date
      t.text :reason_for_end
      t.string :pay_amount
      t.string :invoice

      t.timestamps
    end
  end
end
