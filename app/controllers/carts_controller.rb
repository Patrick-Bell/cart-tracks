class CartsController < ApplicationController
  before_action :set_cart, only: %i[ show update destroy ]

 # GET /carts
def index
  @carts = Cart.includes(:game).all

  render json: @carts.as_json(include: :game)
end


 # GET /carts/1
def show
  @cart = Cart.includes(:workers, :game).find(params[:id])  # Preload workers and game

  render json: @cart, include: [:workers, :game]  # Include both workers and game in the response
end


  # POST /carts
  def create
    cart = Cart.new(cart_params)

    if cart.save
      # Create the cart_workers associations
      cart_data = params[:cart]
      worker_ids = cart_data[:worker_ids]  # Array of worker IDs passed from frontend
      
      worker_ids.each do |worker_id|
        CartWorker.create(cart_id: cart.id, worker_id: worker_id)
      end

      render json: { message: "Cart and workers added successfully", cart: cart }, status: :created
    else
      render json: { errors: cart.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /carts/1
  def update
    @cart = Cart.find(params[:id])
    if @cart.update(cart_params)
      render json: @cart
    else
      render json: @cart.errors, status: :unprocessable_entity
    end
  end

  # DELETE /carts/1
  def destroy
    @cart.destroy!
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_cart
      @cart = Cart.find(params[:id])
    end
    
    # Only allow a list of trusted parameters through.
    def cart_params
      params.require(:cart).permit(:cart_number, :quantities_start, :quantities_added, :quantities_minus, :final_returns, :game_id, :float, :worker_total, :date)
    end
end
