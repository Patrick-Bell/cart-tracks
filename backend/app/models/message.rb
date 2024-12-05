class Message < ApplicationRecord
  belongs_to :manager, optional: true
end
