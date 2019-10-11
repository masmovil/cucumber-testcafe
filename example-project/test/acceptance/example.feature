@only
Feature: Fibra + Móvil

  Scenario: Fibra yoigo 600 + sinfin 8gb
    Given go to "/" url
    And page "home" is ready
    And accept cookies
    When click "fibra+movil" in horizontal menu
    Then tariffs are displayed
