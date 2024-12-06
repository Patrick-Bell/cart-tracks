# app/controllers/sessions_controller.rb
class SessionsController < ApplicationController
    include ActionController::Cookies


    SESSION_KEY = ENV['SESSION_KEY']
  
    def create
        # Find the user by email
        @user = Manager.find_by(email: params[:manager][:email])
      
        # If no user is found, return a custom message for invalid email
        if @user.nil?
          return render json: { error: 'Invalid email address' }, status: :unprocessable_entity
        end
      
        # Authenticate the user with the provided password
        if @user.authenticate(params[:manager][:password])
          # JWT token creation with expiration time of 1 hour
          token = JWT.encode({
            user_id: @user.id,  # Use @user here
            email: @user.email,  # Use @user here
            exp: 1.hour.from_now.to_i
          }, SESSION_KEY, 'HS256')
      
          Rails.logger.debug "Generated Token: #{token}"
      
          # Set the JWT token in cookies (secure, httpOnly, SameSite Lax for security)
          cookie = cookies.signed[:token] = {
            value: token,
            httponly: true,
            same_site: :none,
            expires: 1.hour.from_now,
            secure: Rails.env.production?  # Use secure cookies in production
          }

          @user.update(online: true)
      
          # Generate the picture URL if the user has an attached picture
          picture_url = @user.picture.attached? ? url_for(@user.picture) : nil
      
          # Send a success response with the user info, token, and picture URL
          render json: { message: 'Login Successful', user: @user, token: token, cookie: cookie, picture: picture_url }
        else
          # If password authentication fails, return a custom message for invalid password
          render json: { error: 'Invalid password' }, status: :unauthorized
        end
      end
      
      
  
      def destroy
        # Find the user by the provided ID in the URL
        user = Manager.find_by(id: params[:id])
    
        if user
          # Update the user to set online to false
          user.update(online: false)
          # Clear the authentication token from cookies
          cookies.delete(:token)
          # Respond with a success message
          render json: { message: 'Logged out successfully' }, status: :ok
        else
          # If user is not found, respond with an error
          render json: { error: 'User not found' }, status: :unauthorized
        end
      end

    private

    def decoded_token
      @decoded_token ||= JWT.decode(cookies.signed[:token], SESSION_KEY, true, { algorithm: 'HS256' }).first
    rescue JWT::DecodeError
      nil
    end

  end
  