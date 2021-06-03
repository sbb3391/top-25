class TaskSerializer
  include FastJsonapi::ObjectSerializer
  attributes :description, :due_date, :start_date, :task_type, :task_subtype, :status
  belongs_to :account
  belongs_to :opportunity, optional: true
end
