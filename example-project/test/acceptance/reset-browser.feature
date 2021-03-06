@only
Feature: Can reset browser data between scenarios

  Scenario: Create a todo list
    Given go to "http://todomvc.com/examples/react" full-url
    And todo list is empty
    When add task "first task"
    Then todo list is not empty

  Scenario: Create another todo list
    Given go to "http://todomvc.com/examples/react" full-url
    And todo list is empty
    When add task "other task"
    Then todo list is not empty

  Scenario: Create two differents todo list
    Given go to "http://todomvc.com/examples/react" full-url
    And todo list is empty
    When add task "other task"
    Then todo list is not empty
    When reset browser
    And go to "http://todomvc.com/examples/react" full-url
    Then todo list is empty
    When add task "other task again"
    Then todo list is not empty

