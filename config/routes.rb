Rails.application.routes.draw do
  devise_for :users
  root to: "pages#home"

  get "testing", to: "pages#testing", as: :testing
  post "ask", to: "pages#ask", as: :ask
end
