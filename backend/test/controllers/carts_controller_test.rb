require "test_helper"

class CartsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @cart = carts(:one)
  end

  test "should get index" do
    get carts_url, as: :json
    assert_response :success
  end

  test "should create cart" do
    assert_difference("Cart.count") do
      post carts_url, params: { cart: { cart_number: @cart.cart_number, final_quantity: @cart.final_quantity, final_returns: @cart.final_returns, game_id: @cart.game_id, location: @cart.location, quantities_added: @cart.quantities_added, quantities_minus: @cart.quantities_minus, quantities_start: @cart.quantities_start, total_value: @cart.total_value, total_vouchers: @cart.total_vouchers, vouchers_value: @cart.vouchers_value, worker_id: @cart.worker_id } }, as: :json
    end

    assert_response :created
  end

  test "should show cart" do
    get cart_url(@cart), as: :json
    assert_response :success
  end

  test "should update cart" do
    patch cart_url(@cart), params: { cart: { cart_number: @cart.cart_number, final_quantity: @cart.final_quantity, final_returns: @cart.final_returns, game_id: @cart.game_id, location: @cart.location, quantities_added: @cart.quantities_added, quantities_minus: @cart.quantities_minus, quantities_start: @cart.quantities_start, total_value: @cart.total_value, total_vouchers: @cart.total_vouchers, vouchers_value: @cart.vouchers_value, worker_id: @cart.worker_id } }, as: :json
    assert_response :success
  end

  test "should destroy cart" do
    assert_difference("Cart.count", -1) do
      delete cart_url(@cart), as: :json
    end

    assert_response :no_content
  end
end
