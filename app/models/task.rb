class Task < ApplicationRecord
  belongs_to :acccount
  belongs_to :opportunity
end
