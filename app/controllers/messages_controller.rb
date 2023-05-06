class MessagesController < ApplicationController
  before_action :authenticate_admin, only: [:index, :show]

  def authenticate_admin
    unless current_user && current_user.admin?
      redirect_to root_path, alert: 'You are not authorized to access this page.'
    end
  end

  def index
    @messages = Message.all.order(created_at: :desc)
  end

  def new
    @message = Message.new
  end

  def create
    @message = Message.new(message_params)
    if @message.save
      redirect_to root_path, notice: 'Message sent successfully.'
    else
      render :new
    end
  end

  private

  def message_params
    params.require(:message).permit(:email, :content)
  end

end
