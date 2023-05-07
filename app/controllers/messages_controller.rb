class MessagesController < ApplicationController
  before_action :authenticate_admin, only: [:index, :show]

  def authenticate_admin
    unless current_user && current_user.admin?
      redirect_to root_path, alert: 'You are not authorized to access this page.'
    end
  end

  def index
    case params[:sort]
    when 'newest'
      @messages = Message.order(created_at: :desc)
    when 'oldest'
      @messages = Message.order(created_at: :asc)
    else
      @messages = Message.all
    end
  end

  def new
    @message = Message.new
  end

  def create
    @message = Message.new(message_params)
    if @message.save
      redirect_to root_path
      flash[:notice] = "Your message has been sent. We will get back to you within 3 working days."
      flash[:fade_time] = 3000
    else
      render :new
    end
  end

  def show
    @message = Message.find(params[:id])
  end

  private

  def message_params
    params.require(:message).permit(:email, :content)
  end

end
