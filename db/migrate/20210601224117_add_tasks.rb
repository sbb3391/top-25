class AddTasks < ActiveRecord::Migration[6.1]
  def change
    create_table :tasks do |t|
      t.string :description
      t.date :start_date
      t.date:due_date
      t.references :account, null: false, foreign_key: true
      t.references :opportunity, index: true, foreign_key: false
      t.string :task_type
      t.string :task_subtype
    end
  end
end
