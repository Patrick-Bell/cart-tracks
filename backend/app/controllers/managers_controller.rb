class ManagersController < ApplicationController
  before_action :set_manager, only: %i[ show update destroy ]



  # GET /managers
  def index
    # Include associated games but not the picture attachment
    @managers = Manager.includes(:games).all
  
    # Render the managers with games and picture_url
    render json: @managers.as_json(include: :games, methods: [:picture_url])
  end
  

  # GET /managers/1
  # In your controller (ManagersController)
def show
  @managers = Manager.includes(:games).all
  
  render json: @managers.as_json(include: :games, methods: [:picture_url])

end

 # POST /managers
 def create
  Rails.logger.info "Current admin: #{current_admin.inspect}"

  @manager = Manager.new(manager_params)

  if @manager.save
    if current_admin && current_admin.notifications
      # Send emails only if notifications are enabled
      ManagerMailer.new_manager(@manager).deliver_now
      ManagerMailer.new_manager_admin(@manager).deliver_now
    else
      Rails.logger.debug "Notifications are disabled for the current admin. Emails were not sent."
    end

    render json: @manager, status: :created, location: @manager
  else
    render json: @manager.errors, status: :unprocessable_entity
  end
end


  # PATCH/PUT /managers/1
  def update
    if @manager.update(manager_params)
      render json: @manager
    else
      render json: @manager.errors, status: :unprocessable_entity
    end
  end

  # DELETE /managers/1
  def destroy
    @manager.destroy!
  end



  def enable_notifications
    @manager = Manager.find_by(id: params[:id])
  
    if @manager
      # Log the current state before update
      Rails.logger.debug "Before update: Notifications: #{@manager.notifications}"
  
      # Update the notifications field
      @manager.notifications = true
      if @manager.save
        # Log the new state after saving
        Rails.logger.debug "After update: Notifications: #{@manager.notifications}"
  
        render json: { success: true, message: "Notifications enabled" }, status: :ok
      else
        render json: { success: false, errors: @manager.errors.full_messages }, status: :unprocessable_entity
      end
    else
      render json: { success: false, message: "Manager not found" }, status: :not_found
    end
  end
  
  


  def disable_notifications

    @manager = Manager.find_by(id: params[:id])

    if @manager
      Rails.logger.debug "Before update: Notifications: #{@manager.notifications}"

      @manager.notifications = false
      
      if @manager.save
        Rails.logger.debug "After update: Notifications: #{@manager.notifications}"


        render json: { message: "Notifications updated" }, status: :ok
      else
      render json: { error: "Error updating Mananger" }, status: :unprocessable_entity
      end
    else
      render json: { error: "Manager not found" }, status: :not_found
  end
end






  private
    # Use callbacks to share common setup or constraints between actions.
    def set_manager
      @manager = Manager.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def manager_params
      params.require(:manager).permit(:name, :email, :password, :picture, :phone_number, :last_name)
    end
end
