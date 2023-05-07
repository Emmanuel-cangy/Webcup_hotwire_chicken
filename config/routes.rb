Rails.application.routes.draw do
  devise_for :users
  root to: "pages#home"

  post "ask", to: "pages#ask", as: :ask

  resources :messages, only: [:create, :index, :show] do
    post :reply, on: :member
  end
  get 'contact_us', to: 'messages#new', as: :contact_us
  get 'about', to: 'pages#about', as: :about
end
