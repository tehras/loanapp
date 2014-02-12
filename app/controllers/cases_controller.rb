class CasesController < ApplicationController
  before_action :set_case, only: [:show, :edit, :update, :destroy]

  # GET /cases
  # GET /cases.json
  def index
    @cases = Case.all
    @employees = Employee.all
    @patients = Patient.all
  end

  # GET /cases/1
  # GET /cases/1.json
  def show
    @employees = Employee.all
    @patients = Patient.all
    params["case"];
    if params["case"] != nil then
      respond_to do |format|
        format.html { render :partial => 'cases/show' }
      end
    else
      respond_to do |format|
        format.html {redirect_to employee_url}
      end
    end
  end

  # GET /cases/new
  def new
    @case = Case.new
    @employees = Employee.all
    @patients = Patient.all
  end

  # GET /cases/1/edit
  def edit
    @employees = Employee.all
    @patients = Patient.all
  end

  # POST /cases
  # POST /cases.json
  def create

    @case = Case.new(case_params)

    respond_to do |format|
      if @case.save
        format.html { redirect_to cases_path, notice: 'Case was successfully created.' }
        format.json { render action: 'show', status: :created, location: @cases_path }
      else
        format.html { render action: 'new' }
        format.json { render json: @case.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /cases/1
  # PATCH/PUT /cases/1.json
  def update
    respond_to do |format|
      if @case.update(case_params)
        format.html { redirect_to cases_path, notice: 'Case was successfully updated.' }
        format.json { render action: 'index' }
      else
        format.html { render action: 'edit' }
        format.json { render json: @case.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /cases/1
  # DELETE /cases/1.json
  def destroy
    @case.destroy
    respond_to do |format|
      format.html { redirect_to cases_path }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_case
      @case = Case.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def case_params
      params.require(:case).permit(:employee_id, :patient_id, :start_date, :end_date, :reason_for_end, :pay_amount, :invoice)
    end
end
