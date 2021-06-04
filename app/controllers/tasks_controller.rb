class TasksController < ApplicationController

  def index 
    @accounts = Account.all
  end

  def new

  end
  
  def create
    binding.pry
  end


end
