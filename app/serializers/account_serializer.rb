class AccountSerializer
  include FastJsonapi::ObjectSerializer
  attributes :name, :status, :crm_account_id, :address, :city, :state, :zip, :top_25, :phone_number
  has_many :opportunities
end
