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

  def filter_session
    session[:taskFilter] ? session.delete("taskFilter") : nil 

    session["taskFilter"] = {
      "dateFilter": {},
      "subtypeFilters": [],
      "otherFilters": []
    }

    params[:dateFilter].each {|k, v| session[:taskFilter][:dateFilter][k] = v }
    params[:subtypeFilters].map {|s| session[:taskFilter][:subtypeFilters].push(s) }
    params[:otherFilters].map {|o| session[:taskFilter][:otherFilters].push(o)}

    filter = session[:taskFilter]

    if !filter[:dateFilter].empty?
      if filter[:dateFilter]["due-on"]
        tasks = Task.filter_by_due_date_on(filter[:dateFilter]["due-on"])
      elsif filter[:dateFilter]["due-before"]
        tasks = Task.filter_by_due_date_before(filter[:dateFilter]["due-before"])
      elsif filter[:dateFilter]["due-between-1"]
        arr = filter[:dateFilter].values
        tasks = Task.filter_by_due_date_between(arr[0], arr[1])
      end
    else 
      tasks = Task.all
    end


    if !filter[:subtypeFilters].empty?
      tasks = tasks.filter_by_subtype(filter[:subtypeFilters])
    end

    render json: TaskSerializer.new(tasks)
  end
end
