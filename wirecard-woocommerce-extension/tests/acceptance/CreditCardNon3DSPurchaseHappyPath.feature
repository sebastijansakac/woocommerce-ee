Feature: CreditCardNon3DSPurchaseHappyPath
  As a guest  user
  I want to make a purchase with a Credit Card Non 3DS
  And to see that transaction was successful

  Background:
	Given I activate "creditcard" payment action "pay" in configuration
    And I prepare credit card checkout "Non3DS"
    When I am on "Checkout" page
    And I fill fields with "Customer data"
    Then I see "Wirecard Credit Card"
	And I click "Place order"
	
  @patch @minor @major
  Scenario: purchase
    Given I fill fields with "Valid Credit Card Data"
    When I click "Pay now"
    Then I am redirected to "Order Received" page
    And I see "Order received"
	And I see "creditcard" "purchase" in transaction table
