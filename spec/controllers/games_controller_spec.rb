require 'rails_helper'

RSpec.describe "Games API", type: :request do
  let!(:manager) { create(:manager) }
  let!(:restricted_manager) { create(:manager, :viewer) } # Viewer with limited access


  # Define login_params
  let(:login_params) { { manager: { email: manager.email, password: manager.password } } }
  let(:restricted_login_params) { { manager: { email: restricted_manager.email, password: restricted_manager.password } } }

  # Variable to hold the token
  let(:token) do
    post '/api/login', params: login_params
    # Parse the response body to extract the token
    puts "Response body: #{response.body}"
    JSON.parse(response.body)['token']
  end

  let(:restricted_token) do
    post '/api/login', params: restricted_login_params
    JSON.parse(response.body)['token']
  end

  describe 'POST /api/games' do
    context 'when valid token is provided' do
      it 'creates a new game' do
        post '/api/games', 
             params: { game: { name: 'Test Game', date: Date.today, manager_id: manager.id } },
             headers: { 'Authorization' => "Bearer #{token}" }
        
            puts "Response body: #{response.body}"

        expect(response).to have_http_status(:created)
        expect(JSON.parse(response.body)['name']).to eq('Test Game')
      end
    end

    context 'when token is missing' do
      it 'returns unauthorized error' do
        post '/api/games', 
             params: { game: { name: 'Test Game', date: Date.today, manager_id: manager.id } }
        
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
  
  describe 'DELETE /api/games/:id' do
    context 'when a valid token is provided and has the right access' do
      it 'deletes a game' do
        game = create(:game, manager_id: manager.id)
        puts "Game created: #{game.inspect}"
  
        # Ensure the game exists before making the DELETE request
        expect(Game.exists?(game.id)).to be_truthy
  
        # Make the DELETE request with the correct URL
        delete "/api/games/#{game.id}", 
               headers: { 'Authorization' => "Bearer #{token}" }
  
        # Output the response body for debugging
        puts "Response status: #{response.status}"
        puts "Response body: #{response.body}"
  
        # Ensure the response is 204
        expect(response).to have_http_status(:no_content) 
  
        # Check that the game is no longer in the database
        expect(Game.exists?(game.id)).to be_falsey
      end
    end
  end
  
  describe 'DELETE /api/games/:id' do
    context 'when a valid token is provided but has the wrong access' do
      it 'raises an error' do
        game = create(:game, manager_id: manager.id)
        puts "Game created: #{game.inspect}"
  
        # Ensure the game exists before making the DELETE request
        expect(Game.exists?(game.id)).to be_truthy
  
        # Make the DELETE request with the correct URL
        delete "/api/games/#{game.id}", 
               headers: { 'Authorization' => "Bearer #{restricted_token}" }
  
        # Output the response body for debugging
        puts "Response status: #{response.status}"
        puts "Response body: #{response.body}"
  
        # Ensure the response is 204
        expect(response).to have_http_status(:unauthorized) 
  
      end
    end
  end
  

end
