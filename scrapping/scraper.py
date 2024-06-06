import requests 
from bs4 import BeautifulSoup

def main():
    url = "https://www.deckshop.pro/card/detail/tornado"
    response = requests.get(url)
    soup = BeautifulSoup(response.content, "html.parser")

# Find all div elements with id="synergies"
    synergies_divs = soup.find_all("div", id="synergies")
    for synergies_div in synergies_divs:
        # Extract the heading
        heading = synergies_div.find('h4').text.strip()
        print(f"Heading: {heading}")

        # Extract the description
        description = synergies_div.find('div', class_='text-gray-muted').text.strip()
        print(f"Description: {description}")

        # Find the next sibling div which contains the grid of cards
        next_div = synergies_div.find_next_sibling('div', class_='grid')
        if next_div:
            cards = next_div.find_all('a')
            for card in cards:
                card_slug = card.find('img')['alt']
                card_class = card.find('div').get('class', [])
                has_opacity_25 = 'opacity-25' in card_class
                print(f"Card Slug: {card_slug}, Has opacity-25: {has_opacity_25}")

        print("\n")

        
if __name__ == "__main__":
    main()

    {
      "name": "Knight",
      "id": 26000000,
      "maxLevel": 14,
      "maxEvolutionLevel": 1,
      "elixirCost": 3,
      "iconUrls": {
        "medium": "https://api-assets.clashroyale.com/cards/300/jAj1Q5rclXxU9kVImGqSJxa4wEMfEhvwNQ_4jiGUuqg.png",
        "evolutionMedium": "https://api-assets.clashroyale.com/cardevolutions/300/jAj1Q5rclXxU9kVImGqSJxa4wEMfEhvwNQ_4jiGUuqg.png"
      },
      "rarity": "common"


      "counter_list": [{card_name, dimmed:true}, {card_name, dimmed:true},{card_name, dimmed:true}, etc...]
      "synergiy_list": [{card_name, dimmed:true},{card_name, dimmed:true},{card_name, dimmed:true}, etc...]
    },

111 cartes au total