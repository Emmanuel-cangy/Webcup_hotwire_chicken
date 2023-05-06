require "openai"

class PagesController < ApplicationController
  skip_before_action :authenticate_user!, only: [ :home, :ask, :testing ]

  def home
  end

  def about
  end

  def testing
  end

  def contains_negative_emotion(string, negative_emotions)
    negative_emotions .any? { |emotion| string.include?(emotion) }
  end

  def ask
    dream_description = params[:query]

    client = OpenAI::Client.new(
      access_token: ENV['OPENAI_KEY'],
      uri_base: "https://oai.hconeai.com/",
      request_timeout: 240
    )
    response = client.completions(
      parameters: {
          model: "text-davinci-003",
          prompt: basic_prompt(dream_description),
          max_tokens: 100
      })

    answer = response['choices'][0]['text']

    respond_to do |format|
      if answer
        format.html { render :home }
        format.json { render json: {answer: answer}}
      else
        format.html { render :home }
        format.json { render json: {answer: 'not found'}}
      end
    end
  end

  private

  def basic_prompt(dream_description)
    return "Analyze my dream, give me meaningful feedback in note form. My dream: #{dream_description}. Provide the info: 1. Dream or Nightmare? (1 word only) 2. Themes: Key themes 3. Emotions: Emotional context, significance 4. Predictions: brief personalized predictions and insights: Relationships/ Work-related issues/ Academic challenges/ Health concerns(if present). Provide a structured & factual response. Limit to 700 characters."
  end
end
