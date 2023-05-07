class Message < ApplicationRecord
  validates :content, presence: true, length: { minimum: 15, maximum: 350 }
  validates :email, presence: true, format: { with: /\A.+@.+\z/, message: "invalid email format" }
end
