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

  def testing_css

    respond_to do |format|
      format.html { render "accounts/testing_css", :layout => false  }
    end
  end

  def show
    account = Account.find_by_id(params[:id])
    options = {include: [:opportunities]}
    render json: AccountSerializer.new(account, options)
  end
end
