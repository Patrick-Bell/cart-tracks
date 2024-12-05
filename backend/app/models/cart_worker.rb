class CartWorker < ApplicationRecord
  belongs_to :cart
  belongs_to :worker
end
