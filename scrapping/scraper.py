import requests
from bs4 import BeautifulSoup
import json

def main():
    card_slug_list = [
        "archers",
        "archer-queen",
        "arrows",
        "baby-dragon",
        "balloon",
        "bandit",
        "barbarians",
        "barbarian-barrel",
        "barbarian-hut",
        "bats",
        "battle-healer",
        "battle-ram",
        "bomb-tower",
        "bomber",
        "bowler",
        "cannon",
        "cannon-cart",
        "clone",
        "dark-prince",
        "dart-goblin",
        "deck-of-many-spells",
        "earthquake",
        "electro-dragon",
        "electro-giant",
        "electro-spirit",
        "electro-wizard",
        "elite-barbarians"
        "elixir-collector",
        "elixir-golem",
        "executioner",
        "fisherman",
        "firecracker",
        "fire-spirit",
        "fireball",
        "flying-machine",
        "freeze",
        "furnace",
        "giant",
        "giant-snowball",
        "giant-skeleton"
        "goblin-barrel",
        "goblin-cage",
        "goblin-drill",
        "goblin-gang",
        "goblin-giant",
        "goblin-hut",
        "goblins",
        "golden-knight",
        "golem",
        "graveyard",
        "guards",
        "heal-spirit",
        "hog-rider",
        "hunter",
        "ice-golem",
        "ice-spirit",
        "ice-wizard",
        "inferno-dragon",
        "inferno-tower",
        "knight",
        "lava-hound",
        "lightning",
        "little-prince",
        "log",
        "lumberjack",
        "magic-archer",
        "mega-knight",
        "mega-minion",
        "mighty-miner",
        "miner",
        "mini-pekka"
        "minion_horde",
        "minions",
        "mirror",
        "monk",
        "mortar",
        "mother-witch",
        "musketeer",
        "night-witch",
        "pekka",
        "phoenix",
        "poison",
        "prince",
        "princess",
        "ram-rider",
        "rage",
        "rascals",
        "rocket",
        "royal-delivery",
        "royal-giant",
        "royal-guards",
        "royal-ghost",
        "royal-hogs",
        "royal-recruits",
        "skeleton-army",
        "skeleton-barrel",
        "skeleton-dragons",
        "skeleton-king",
        "skeletons",
        "sparky",
        "spear-goblins",
        "spell-valley",
        "tesla",
        "the-log",
        "three-musketeers",
        "tombstone",
        "tornado",
        "trio-of-musketeers",
        "valkyrie",
        "void",
        "wall-breakers",
        "witch",
        "wizard",
        "x-bow",
        "zap",
        "zappies"
    ]

    print(len(card_slug_list))

    all_cards = []

    for slug in card_slug_list:
        url = f"https://www.deckshop.pro/card/detail/{slug}"
        print(f"Scraping details for card: {slug}")  # Print the name of the card
        response = requests.get(url)
        soup = BeautifulSoup(response.content, "html.parser")

        results = {"slug": slug}  # Add the card name to the results

        # Find all div elements with id="synergies"
        synergies_divs = soup.find_all("div", id="synergies")

        for synergies_div in synergies_divs:
            full_heading = synergies_div.find('h4').text.strip().lower()
            #print(f"Heading: {heading}")

            #Check if heading contains one of the keywords
            keywords = ["counters","counter","synergies"]
            heading = next((keyword for keyword in keywords if keyword in full_heading), None)

            if heading is not None:

                # Find the next sibling div which contains the grid of cards
                next_div = synergies_div.find_next_sibling('div', class_='grid')
                cards_list = []
                if next_div:
                    cards = next_div.find_all('a')
                    for card in cards:
                        card_slug = card.find('img')['alt']
                        card_class = card.find('div').get('class', [])
                        dimmed = 'opacity-25' in card_class
                        #print(f"{card_slug}, dimmed: {dimmed}")
                        cards_list.append({"card_slug": card_slug, "dimmed": dimmed})

                print("\n")
                results[heading] = cards_list

        all_cards.append(results)  # Add the results to the all_cards list

        # Export the results to a JSON file
        with open('test2.json', 'w') as f:
            json.dump(all_cards, f)

if __name__ == "__main__":
    main()