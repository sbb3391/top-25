class OpportunitiesController < ApplicationController

  def show
    opp = opportunity.find_by_id(params[:id])
    options = {include: [:tasks]}

    render json: OpportunitySerializer.new(opp, options)

  end
end
