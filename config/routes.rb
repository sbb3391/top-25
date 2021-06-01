Rails.application.routes.draw do
  resources :tasks
  resources :opportunities
  resources :accounts do 
    collection do
      post :select
    end
    
    member do
    end
  end
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
