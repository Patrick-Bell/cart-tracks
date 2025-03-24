class Game < ApplicationRecord
  belongs_to :manager
  has_one :fixture
  has_many :carts, dependent: :destroy
end
