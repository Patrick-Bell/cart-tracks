require 'rails_helper'

RSpec.describe SessionsController, type: :controller do
  let!(:manager) { create(:manager, email: "test@example.com", password: "password123") }

  describe "POST #create (Login)" do
    context "when credentials are correct" do
      it "logs in successfully and returns a token" do
        post :create, params: { manager: { email: "test@example.com", password: "password123" } }
        json = JSON.parse(response.body)
        expect(response).to have_http_status(:ok)
        expect(json["message"]).to eq("Login Successful")
        expect(json["user"]["email"]).to eq(manager.email)
        expect(json["token"]).not_to be_nil
      end
    end

    context "when email is invalid" do
      it "returns an error" do
        post :create, params: { manager: { email: "wrong@example.com", password: "password123" } }
        json = JSON.parse(response.body)
        expect(response).to have_http_status(:unprocessable_entity)
        expect(json["error"]).to eq("Invalid email address")
      end
    end

    context "when password is incorrect" do
      it "returns an unauthorized error" do
        post :create, params: { manager: { email: "test@example.com", password: "wrongpassword" } }
        json = JSON.parse(response.body)
        expect(response).to have_http_status(:unauthorized)
        expect(json["error"]).to eq("Invalid password")
      end
    end
  end
end
