class CreateAccounts < ActiveRecord::Migration[6.1]
  def change
    create_table :accounts do |t|
      t.string :name
      t.string :status
      t.string :crm_account_id
      t.string :address
      t.string :city
      t.string :state
      t.string :zip
      t.boolean :top_25
      t.string :phone_number
  
      t.timestamps
    end
  end
end
