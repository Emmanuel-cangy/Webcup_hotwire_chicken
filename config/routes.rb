Rails.application.routes.draw do
  devise_for :users
  root to: "pages#home"


  get "testing", to: "pages#testing", as: :testing
  post "ask", to: "pages#ask", as: :ask

  resources :messages, only: [:new, :create, :index, :show] do
    post :reply, on: :member
  end
  get 'contact_us', to: 'messages#new', as: :contact_us
  get 'about', to: 'pages#about'
end
