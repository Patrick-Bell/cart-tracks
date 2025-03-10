class ApplicationController < ActionController::Base
  before_action :authenticate_user
  skip_before_action :verify_authenticity_token # Disables CSRF protection


  SESSION_KEY = ENV['SESSION_KEY']

  def authenticate_user
    token = cookies.signed[:token]  # Grab the token from cookies
    return render_unauthorized("No token provided") unless token  # No token? Deny access.

    begin
      # Decode the JWT token and ensure it's valid and not expired
      decoded_token = JWT.decode(token, SESSION_KEY, true, { algorithm: 'HS256' })
      user_id = decoded_token[0]['user_id']
      exp = decoded_token[0]['exp']  # Get expiration time

      # Check if token is expired
      if Time.at(exp) < Time.now
        Rails.logger.error "JWT Token has expired"
        return render_unauthorized("JWT Token has expired")
      end

      @current_user = Manager.find_by(id: user_id)  # Find the user by the decoded ID
      puts @current_user.inspect
      return render_unauthorized("User not found") unless @current_user

    rescue JWT::DecodeError => e
      Rails.logger.error "JWT Decode Error: #{e.message}"
      render_unauthorized("Invalid token")
    end
  end

  def render_unauthorized(message)
    render json: { error: message }, status: :unauthorized
  end


def authorize_admin
  unless @current_user&.role == 'admin'
    render json: { error: 'You do not have access to this' }, status: :unauthorized
  end
end




=begin

=end



def current_user
  token = cookies.signed[:token]
  Rails.logger.info "Token from cookies: #{token}"  # Log the token being read
  return nil unless token

  begin
      # Decode the token to verify it and check for expiration
      decoded_token = JWT.decode(token, SESSION_KEY, true, { algorithm: 'HS256' })
      Rails.logger.info "Decoded Token: #{decoded_token}"

      user_id = decoded_token[0]['user_id']
      exp = decoded_token[0]['exp']  # Get expiration time from the token (in seconds)

      # Check if the token has expired
      if Time.at(exp) < Time.now
          Rails.logger.error "JWT Token has expired"
          destroy  # Call the destroy method to log the user out
          return nil
      end

      # If the token is valid and not expired, find and return the current user
      @current_user ||= Manager.find(user_id)

      picture_url = @current_user.picture.attached? ? url_for(@current_user.picture) : nil

      render json: { user: @current_user, picture_url: picture_url }
  rescue JWT::DecodeError => e
      Rails.logger.error "JWT Decode Error: #{e.message}"  # Log decode errors
      return nil
  end
end


def current_admin
  token = cookies.signed[:token]
  Rails.logger.info "Token from cookies: #{token}"  # Check if the token exists

  return nil unless token

  begin
    decoded_token = JWT.decode(token, SESSION_KEY, true, { algorithm: 'HS256' })
    Rails.logger.info "Decoded Token: #{decoded_token}"  # Check if the token is decoded properly

    user_id = decoded_token[0]['user_id']
    Rails.logger.info "User ID from decoded token: #{user_id}"  # Check user ID from token
    exp = decoded_token[0]['exp']
    Rails.logger.info "Token expiration time: #{exp}"  # Check expiration time

    # Check if the token is expired
    if Time.at(exp) < Time.now
      Rails.logger.error "JWT Token has expired"
      return nil
    end

    # Find the manager based on user_id
    @current_admin ||= Manager.find_by(id: user_id)
    Rails.logger.info "Current Admin: #{@current_admin.inspect}"  # Check the admin object

    return @current_admin
  rescue JWT::DecodeError => e
    Rails.logger.error "JWT Decode Error: #{e.message}"  # Log the error message if decoding fails
    return nil
  end
end

def set_current_admin
  @current_admin = current_admin  # Ensure it's stored in @current_admin
end


end
