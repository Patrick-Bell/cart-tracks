class Cart < ApplicationRecord
  belongs_to :game
  has_many :cart_workers, dependent: :destroy
  has_many :workers, through: :cart_workers

  before_create :calculations
  before_update :calculations

  def calculations
    # Ensure quantities and final_returns are not nil
    self.quantities_start ||= 0
    self.quantities_added ||= 0
    self.quantities_minus ||= 0
    self.final_returns ||= 0
    self.float ||= 0 # Ensure float is not nil
    self.worker_total ||= 0

    Rails.logger.debug "Quantities Start: #{quantities_start}"
    Rails.logger.debug "Quantities Added: #{quantities_added}"
    Rails.logger.debug "Quantities Minus: #{quantities_minus}"
    Rails.logger.debug "Final Returns: #{final_returns}"
    Rails.logger.debug "Float: #{float}"

    # Calculate final_quantity
    self.final_quantity = quantities_start + (quantities_added - quantities_minus)
    Rails.logger.debug "Final Quantity (Calculated): #{final_quantity}"

    # Calculate sold based on final_quantity and final_returns
    self.sold = final_quantity - final_returns
    Rails.logger.debug "Sold (Calculated): #{sold}"

    # Calculate total_value
    self.total_value = sold * 4
    Rails.logger.debug "Total Value (Calculated): #{total_value}"

    self.worker_total = (worker_total - float)
  end
end
