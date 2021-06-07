class TasksController < ApplicationController
  wrap_parameters :tasks, format: [:json, :xml, :url_encoded_form, :multipart_form]
  
  def index 
    @accounts = Account.all
  end

  def new

  end

  def create
    binding.pry
  end

  def search
  end

  def filter_check
    message = {}
    message[:json] = "no filters"
    # session[:taskFilter] ? render json: session[:taskFilter] : render json: message

    if session[:taskFilter] 
      render json: session[:taskFilter]
    else
      render json: message
    end
  end

  def remove_filter
    message = {}
    message[:json] = "no filters"

    session.delete("taskFilter")
    render json: message
  end

  def filter
    session[:taskFilter] ? session.delete("taskFilter") : nil 

    session["taskFilter"] = {
      "dateFilter": {},
      "subtypeFilters": [],
      "otherFilters": []
    }

    params[:dateFilter].each {|k, v| session[:taskFilter][:dateFilter][k] = v }
    params[:subtypeFilters].map {|s| session[:taskFilter][:subtypeFilters].push(s) }
    params[:otherFilters].map {|o| session[:taskFilter][:otherFilters].push(o)}

    render json: session[:taskFilter]
  end
end
