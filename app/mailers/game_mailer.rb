class GameMailer < ApplicationMailer
    def game_complete(game, unique_carts)
      @game = game
      @manager = game.manager
      @carts = game.carts.includes(:workers) # Load associated workers to reduce queries
      @unique_carts = unique_carts
  
      # Flatten and deduplicate workers across all carts
      @workers = @carts.flat_map(&:workers).uniq
  
      # Calculate totals
      @total_worker_value = @unique_carts.sum(&:worker_total)
      @total_expected_value = @unique_carts.sum(&:total_value)
      @margin = @total_worker_value - @total_expected_value
  
      mail(to: ENV['EMAIL'], subject: 'New Game Completed')
    end
  end
  