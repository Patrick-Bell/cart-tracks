=begin class ChatChannel < ApplicationCable::Channel
  def subscribed
    if current_user
      stream_from "chat_room"
      
      # Log the connection
      Rails.logger.info "#{current_user.name} has connected to the chat room."

      #Message.create(content: "#{current_user.name} has connected to the chat", manager_id: 36)
      #ActionCable.server.broadcast("chat_room", { content: "#{current_user.name} is now connected!", manager_id: 36 })
    else
      reject
      Rails.logger.error "Connection attempt rejected: No current_user."
    end
  end

  def unsubscribed
    # Log the disconnection
    if current_user
      Rails.logger.info "#{current_user.name} has disconnected from the chat room."

      #Message.create(content: "#{current_user.name} has disconnected from the chat", manager_id: 36)
      #ActionCable.server.broadcast("chat_room", { content:  "#{current_user.name} has now disconnected!", manager_id: 36 })

    else
      Rails.logger.error "Unsubscribed: No current_user available to disconnect."
    end
    
    # Stop all streams
    stop_all_streams
  end

  def speak(data)
    Rails.logger.debug "Received message data: #{data.inspect}"  # Log to verify the structure of the incoming data

    # Ensure the data contains the necessary content
    if data['content'].present?
      # Log before creating the message
      Rails.logger.debug "Creating message with content: #{data['content']} from #{current_user.name}"

      # Create the message in the database
      message = Message.create(content: data['content'], manager_id: current_user.id)

      # Log after message creation
      Rails.logger.info "Message created by #{current_user.name}: #{message.content}"

      # Broadcast the message to the stream
      ActionCable.server.broadcast("chat_room", { content: message.content, manager_id: message.manager_id })

    else
      # Log invalid content (if any)
      Rails.logger.error "Invalid message content: #{data['content']}"
    end
  end

  def stream_exists?
    subscriptions.any? { |subscription| subscription.stream_identifier.present? }
  end

  
end
=end