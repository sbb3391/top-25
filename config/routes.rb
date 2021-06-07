Rails.application.routes.draw do
  resources :tasks do 
    collection do
      post :search
      post :filter
      get :filter_check
      get :remove_filter
    end
  end

  resources :opportunities
  resources :accounts do 
    collection do
      post :select
      get :testing_css
    end
    
    member do
    end
  end
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
