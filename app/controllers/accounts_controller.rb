class AccountsController < ApplicationController
  
  def index
    @accounts = Account.all
    binding.pry
  end
end
