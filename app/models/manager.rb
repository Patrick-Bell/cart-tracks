class Manager < ApplicationRecord
    has_many :games
    has_one_attached :picture  # This is the ActiveStorage association
    has_secure_password

    after_create = :set_default_online
    after_create = :set_default_access

    validates :email, presence: true, uniqueness: true

    def set_default_access
      self.access = 'high'
    end
    
    # Method to return the picture URL
    def picture_url
      picture.attached? ? Rails.application.routes.url_helpers.rails_blob_url(picture, only_path: true) : nil
    end

    def set_default_online
      self.update_column(:online, false) if self.online.nil?
    end

  end
  