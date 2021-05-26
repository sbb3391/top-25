class CreateOpportunities < ActiveRecord::Migration[6.1]
  def change
    create_table :opportunities do |t|
      t.date :close_date
      t.text :description
      t.references :account, null: false, foreign_key: true

      t.timestamps
    end
  end
end
