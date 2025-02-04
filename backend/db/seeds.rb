
# Find or create a game
game = Game.find_or_create_by!(
    name: "West Ham United v Brentford (Premier League)",
    date: "2025-02-15",
    manager_id: 4,
    complete_status: false,
    fixture_id: nil
)

# Ensure game is properly created
if game.nil?
  raise "Game could not be created!"
end

# Create carts linked to the game
carts_data = [
    { cart_number: "1", quantities_start: 200, quantities_added: 20, quantities_minus: 10, final_quantity: 180, final_returns: 5, total_value: 1200.50, float: 90, worker_total: 1350.75, sold: 175, date: game.date, worker_id: 2 },
    { cart_number: "2", quantities_start: 150, quantities_added: 20, quantities_minus: 10, final_quantity: 140, final_returns: 3, total_value: 980.75, float: 90, worker_total: 1125.00, sold: 137, date: game.date, worker_id: 3},
    { cart_number: "3", quantities_start: 250, quantities_added: 20, quantities_minus: 20, final_quantity: 230, final_returns: 10, total_value: 1100.25, float: 90, worker_total: 1200.50, sold: 220, date: game.date, worker_id: 4 },
    { cart_number: "4", quantities_start: 300, quantities_added: 20, quantities_minus: 10, final_quantity: 290, final_returns: 7, total_value: 1300.60, float: 90, worker_total: 1400.25, sold: 270, date: game.date, worker_id: 5 },
    { cart_number: "5", quantities_start: 300, quantities_added: 20, quantities_minus: 10, final_quantity: 290, final_returns: 7, total_value: 1300.60, float: 90, worker_total: 1400.25, sold: 270, date: game.date, worker_id: 10 },
    { cart_number: "7", quantities_start: 300, quantities_added: 20, quantities_minus: 10, final_quantity: 290, final_returns: 7, total_value: 1300.60, float: 90, worker_total: 1400.25, sold: 270, date: game.date, worker_id: 6 },
    { cart_number: "10", quantities_start: 300, quantities_added: 20, quantities_minus: 10, final_quantity: 290, final_returns: 7, total_value: 1300.60, float: 90, worker_total: 1400.25, sold: 270, date: game.date, worker_id: 7 },
    { cart_number: "BR2", quantities_start: 300, quantities_added: 20, quantities_minus: 10, final_quantity: 290, final_returns: 7, total_value: 1300.60, float: 90, worker_total: 1400.25, sold: 270, date: game.date, worker_id: 17 },
    { cart_number: "11", quantities_start: 300, quantities_added: 20, quantities_minus: 10, final_quantity: 290, final_returns: 7, total_value: 1300.60, float: 90, worker_total: 1400.25, sold: 270, date: game.date, worker_id: 8 },
    { cart_number: "14", quantities_start: 300, quantities_added: 20, quantities_minus: 10, final_quantity: 290, final_returns: 7, total_value: 1300.60, float: 90, worker_total: 1400.25, sold: 270, date: game.date, worker_id: 9 },
    { cart_number: "15", quantities_start: 300, quantities_added: 20, quantities_minus: 10, final_quantity: 290, final_returns: 7, total_value: 1300.60, float: 90, worker_total: 1400.25, sold: 270, date: game.date, worker_id: 11 },
    { cart_number: "16", quantities_start: 300, quantities_added: 20, quantities_minus: 10, final_quantity: 290, final_returns: 7, total_value: 1300.60, float: 90, worker_total: 1400.25, sold: 270, date: game.date, worker_id: 12 },
    { cart_number: "17", quantities_start: 300, quantities_added: 20, quantities_minus: 10, final_quantity: 290, final_returns: 7, total_value: 1300.60, float: 90, worker_total: 1400.25, sold: 270, date: game.date, worker_id: 13 },
    { cart_number: "Gazebo 1", quantities_start: 300, quantities_added: 20, quantities_minus: 10, final_quantity: 290, final_returns: 7, total_value: 1300.60, float: 90, worker_total: 1400.25, sold: 270, date: game.date, worker_id: 14 },
    { cart_number: "Gazebo 2", quantities_start: 300, quantities_added: 20, quantities_minus: 10, final_quantity: 290, final_returns: 7, total_value: 1300.60, float: 90, worker_total: 1400.25, sold: 270, date: game.date, worker_id: 15 },


]

# Loop through and create carts for the game
carts_data.each do |cart_data|
  cart = game.carts.create!(cart_data.except(:worker_id))  # Create the cart linked to the game
  CartWorker.create!(cart_id: cart.id, worker_id: cart_data[:worker_id])  # Link cart to worker via CartWorker
end

puts "Seeded Game ID: #{game.id} with #{game.carts.count} carts and workers!"
