class GamesController < ApplicationController
    before_action :set_game, only: [:show]  # This callback can be kept if you need a show action
    before_action :authorize_admin, only: [:destroy]

    
    def index
      year = params[:year].to_i
    
      if year == 0
        # If 'All' is selected (i.e., year == 0), return all games
        @games = Game.includes(carts: :workers).all
      elsif year
        # Filter games released in the specified year
        @games = Game.includes(carts: :workers).where(date: Date.new(year, 1, 1)..Date.new(year, 12, 31))
      else
        # Default case: return all games if no year is provided
        @games = Game.includes(carts: :workers).all
      end
    
      # Render the games, including carts with workers and manager data
      render json: @games, include: { carts: { include: :workers }, manager: {} }
    end
    
        

    def create
      @game = Game.new(game_params)
  
      if @game.save
        render json: @game, status: :created, location: @game
      else
        render json: @game.errors, status: :unprocessable_entity
      end
    end

    def completed_game
      # Fetch the game by ID and handle record not found
      begin
        @game = Game.includes(carts: :workers).find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Game not found' }, status: :not_found
        return
      end
    
      # Check if the game is already completed
      if @game.complete_status
        render json: { error: 'Game is already completed' }, status: :unprocessable_entity
        return
      end
    
      # Mark game as completed
      @game.complete_status = true
      @unique_carts = @game.carts.uniq { |cart| cart.cart_number }
    
      if @game.save
        # Return the updated game data with eager-loaded associations
        #GameMailer.game_complete(@game, @unique_carts).deliver_now
        render json: @game, include: { carts: { include: :workers }, manager: {} }
      else
        render json: @game.errors, status: :unprocessable_entity
      end
    end
    
    def show
      render json: @game, include: { carts: { include: :workers }, manager: {} }
    end

    def destroy
      @game = Game.find(params[:id])

      @game.destroy!
    end
    
    private
    
    def set_game
      @game = Game.find(params[:id])
    end

    def game_params
      params.require(:game).permit(:name, :date, :manager_id)
    end


  end
  