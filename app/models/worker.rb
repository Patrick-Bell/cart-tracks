class Worker < ApplicationRecord
    has_many :games
    has_many :cart_workers
    has_many :carts , through: :cart_workers
    has_one_attached :picture


    def picture_url
        picture.attached? ? Rails.application.routes.url_helpers.rails_blob_url(picture, only_path: true) : ''
      end
end
