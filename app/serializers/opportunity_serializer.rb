class OpportunitySerializer
  include FastJsonapi::ObjectSerializer
  attributes :close_date, :description
  belongs_to :account
  has_many :tasks
end
