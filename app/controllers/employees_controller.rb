class EmployeesController < ApplicationController
  before_action :set_employee, only: [:show, :edit, :update, :destroy]

  # GET /employees
  # GET /employees.json
  def index
    var = params['variable']
    @employees = Employee.all
    @patients = Patient.all
    @cases = Case.all
    if var == "employeeList"
      respond_to do |format|
        format.html { render :partial=> 'employees/datatableEmployee'}
      end
    elsif var == "employeeTable"
      respond_to do |format|
        format.html { render :partial=> 'employees/listEmployee'}
      end
    end
  end

  # GET /employees/1
  # GET /employees/1.json
  def show
    params["employee"];
    if params["employee"] != nil then
      respond_to do |format|
        format.html { render :partial => 'employees/show' }
      end
    else
      respond_to do |format|
        format.html {redirect_to employee_url}
      end
    end
  end

  # GET /employees/new
  def new
    @employee = Employee.new
  end

  # GET /employees/1/edit
  def edit
  end

  # POST /employees
  # POST /employees.json
  def create
    @employee = Employee.new(employee_params)

    respond_to do |format|
      if @employee.save
        format.html { redirect_to employees_path, notice: 'Employee was successfully created.' }
        format.json { render action: 'show', status: :created, location: @employee }
      else
        format.html { render action: 'new' }
        format.json { render json: @employee.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /employees/1
  # PATCH/PUT /employees/1.json
  def update
    respond_to do |format|
      if @employee.update(employee_params)
        format.html { redirect_to employees_path, notice: 'Employee was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @employee.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /employees/1
  # DELETE /employees/1.json
  def destroy
    @employee.destroy
    respond_to do |format|
      format.html { redirect_to employees_url }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_employee
      @employee = Employee.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def employee_params
      params.require(:employee).permit(:first_name, :last_name, :email, :home_number, :mobile_number, :fax_number, :street, :city, :state, :zip, :nationality, :language, :english, :years_inUs, :hha_lic, :driver_lic, :access_toCar, :notes)
    end
end
