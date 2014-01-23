class UsersController < ApplicationController
  before_action :authenticate_user!, except: [:validate]

  def index
    authorize! :index, @user, :message => 'Not authorized as an administrator.'
    @users = User.all.order(:name)
  end

  def show
    @user = User.find(params[:id])
    authorize! :show, @user, :message => 'Not authorized to do that.'
  end
  
  def update
    @user = User.find(params[:id])
    authorize! :update, @user, :message => 'Not authorized as an administrator.'
    if @user.update_attributes(user_params)
      redirect_to users_path, :notice => "User updated."
    else
      redirect_to users_path, :alert => "Unable to update user."
    end
  end
    
  def destroy
    authorize! :destroy, @user, :message => 'Not authorized as an administrator.'
    user = User.find(params[:id])
    unless user == current_user
      user.destroy
      redirect_to users_path, :notice => "User deleted."
    else
      redirect_to users_path, :notice => "Can't delete yourself."
    end
  end

  def validate
    if User.where('email = ?', params[:email].downcase).count == 0
      render :nothing => true, :status => 200
    else
      render :nothing => true, :status => 409
    end
    return
  end

  private
    def user_params
      params.require(:user).permit(:name, :email, :role_ids)
    end
end