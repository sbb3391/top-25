class CreateTasks < ActiveRecord::Migration[6.1]
  def change
    create_table :tasks do |t|
      t.string :description
      t.string :start_date
      t.string :due_date
      t.references :acccount, null: false, foreign_key: true
      t.references :opportunity, null: false, foreign_key: true
      t.string :type
      t.string :subtype

      t.timestamps
    end
  end
end
