class WorkersController < ApplicationController
  before_action :set_worker, only: %i[ show update destroy ]

# GET /workers
def index
  @workers = Worker.includes(carts: [:cart_workers, :game]).all

  render json: @workers.as_json(include: { 
    carts: { 
      include: [:cart_workers, :game]  # Include both cart_workers and game for each cart
    } 
  }, methods: [:picture_url])
end



  # GET /workers/1
  def show
    @workers = Worker.includes(:carts).all

    render json: @workers.as_json(include: :carts, methods: [:picture_url])
  end

  # POST /workers
  def create
    @worker = Worker.new(worker_params)

    if @worker.save
      render json: @worker, status: :created, location: @worker
    else
      render json: @worker.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /workers/1
  def update
    Rails.logger.debug("Worker Params: #{worker_params.inspect}")
    @worker = Worker.find(params[:id])
    if @worker.update(worker_params)
      render json: @worker
    else
      render json: @worker.errors, status: :unprocessable_entity
    end
  end


  def send_email
    emails = params[:emails]
    email_body = params[:email_body]
    subject = params[:subject]

    emails.each do |email|
      WorkerMailer.send_worker_email(email, email_body, subject).deliver_now
    end

    render json: { message: "Email(s) sent successfully! YEAH!" }, status: :ok

  end


  def add_watching
    @worker = Worker.find(params[:id])

    @worker.watching = true

    if @worker.save
      # Return the updated game data with eager-loaded associations
      render json: @worker
    else
      render json: @worker.errors, status: :unprocessable_entity
    end
  end
  
  
  def remove_watching
    @worker = Worker.find(params[:id])

    @worker.watching = false

    if @worker.save
      render json: @worker
    else
      render json: @worker.errors, status: :unprocessable_entity
  end
end



  # DELETE /workers/1
  def destroy
    @worker.destroy!
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_worker
      @worker = Worker.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def worker_params
      params.require(:worker).permit(:name, :last_name, :email, :phone_number, :picture, :address)
    end
end
