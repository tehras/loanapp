class HomeController < ApplicationController
  def index
    @user = current_user
    @employees = Employee.order("updated_at DESC").limit(5)
    @patients = Patient.order("updated_at DESC").limit(5)
    @cases = Case.order("updated_at DESC").limit(5)
    @employeesAll = Employee.all
    @patientsAll = Patient.all
  end
end
