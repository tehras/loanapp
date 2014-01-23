Loanapp::Application.routes.draw do
  resources :patients

  root :to => "home#index"
  get '/users/validate', to: 'users#validate'
  devise_for :users, :controllers => {:registrations => "registrations"}
  resources :users
end