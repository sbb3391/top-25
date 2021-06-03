class TasksController < ApplicationController

  def index 
    @accounts = Account.all
  end
end
