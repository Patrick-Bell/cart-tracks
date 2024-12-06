=begin module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      # Attempt to find the verified user by token
      find_verified_user
    end

    def find_verified_user
      token = cookies.signed[:token]
      Rails.logger.debug "Token received for connection: #{token}"

      return reject_unauthorized_connection unless token

      begin
        decoded_token = JWT.decode(token, ENV['SESSION_KEY'], true, { algorithm: 'HS256' })
        user_id = decoded_token[0]['user_id']
        @manager = Manager.find_by(id: user_id)

        if @manager
          self.current_user = @manager
          Rails.logger.info "Manager authenticated: #{@manager.id}, #{@manager.email}"
        else
          Rails.logger.error "Manager not found for user_id: #{user_id}"
          reject_unauthorized_connection
        end
      rescue JWT::DecodeError => e
        Rails.logger.error "JWT Decode Error: #{e.message}"
        reject_unauthorized_connection
      end
    end
  end
end

=end