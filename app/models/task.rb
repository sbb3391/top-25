class Task < ApplicationRecord
  belongs_to :account
  belongs_to :opportunity, optional: true
end
