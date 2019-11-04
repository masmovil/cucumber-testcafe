@only
Feature: Fibra + Móvil

  Scenario: test OK
    Given go to "home" page
    And accept cookies
    When click "fibra+movil" in horizontal menu
    Then tariffs are displayed

  @ignore
  Scenario: test Fail
    Given go to "home" page
    And accept cookies
    When click "fibra+" in horizontal menu
    Then tariffs are displayed

  Scenario: test OK
    Given go to "home" page
    And accept cookies
    When click "fibra+movil" in horizontal menu
    Then tariffs are displayed
