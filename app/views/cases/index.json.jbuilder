json.array!(@cases) do |case|
  json.extract! case, :id, :start_date, :end_date, :reason_for_end, :pay_amount, :invoice
  json.url case_url(case, format: :json)
end
