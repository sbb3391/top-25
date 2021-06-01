class AccountsController < ApplicationController
  protect_from_forgery with: :null_session
  
  def index
    @accounts = Account.all
  end

  def select
    account = Account.find_by_id(params[:accountId])
    options = {include: [:opportunities]}
    render json: AccountSerializer.new(account, options)
  end
end
