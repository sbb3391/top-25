class AccountsController < ApplicationController
  
  def index
    @accounts = Account.all
  end

  def select
    account = Account.find_by_id(params[:account])

    render json: account.to_json
  end
end
