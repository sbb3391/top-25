class Task < ApplicationRecord
  belongs_to :account
  belongs_to :opportunity, optional: true

  scope :filter_by_subtype, ->(arr) { where("task_subtype IN (?)", arr) }
  scope :filter_by_due_date_on, ->(date) { where("due_date = ?", date)}
  scope :filter_by_due_date_between, ->(begin_date, end_date) { where("due_date >= ? AND due_date <= ?", begin_date, end_date) }
  scope :filter_by_due_date_before, ->(date) { where("due_date <= ?", date)}
  
end
